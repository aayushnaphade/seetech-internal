import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { prisma } from '../../../lib/db/prisma';

/**
 * GET: Generate and download a PDF for a specific project
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { projectId } = req.query;
    
    if (!projectId || isNaN(Number(projectId))) {
      return res.status(400).json({ message: 'Valid project ID is required' });
    }
    
    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: {
        client: true,
        constants: true
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get the hostname for the current request
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'] || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // The URL to the PDF preview page
    const url = `${baseUrl}/pdf/${projectId}`;
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to A4
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2
    });
    
    // Navigate to the PDF preview page
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for charts and content to load
    await page.waitForSelector('.a4-page-container', { visible: true });
    
    // Small additional delay to ensure all charts render
    await page.waitForTimeout(500);
    
    // Generate PDF with A4 size and proper margins
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' }
    });
    
    // Close browser
    await browser.close();
    
    // Set response headers for PDF download
    const projectName = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${projectName}_proposal_${timestamp}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', pdf.length);
    
    // Send the PDF
    res.send(pdf);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}

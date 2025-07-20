"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

// @ts-ignore: missing types for react-plotly.js
// Plotly gauge (client-side only)
const Plot: any = dynamic(() => import('react-plotly.js'), { ssr: false });

// Enhanced modern professional styles matching the Python version EXACTLY
const proposalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700&display=swap');
  
  @page {
    size: A4;
    margin: 0;
  }
  
  @media print {
    body {
      margin: 0;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    .a4-page-container {
      box-shadow: none;
      margin-bottom: 0;
    }
    
    .gauge-container, .chart-container {
      break-inside: avoid;
    }
  }
  
  .proposal-container {
    font-family: 'Inter', 'Montserrat', sans-serif;
    max-width: 21cm;
    margin: 0 auto;
    background: white;
    color: #2D3B45;
    line-height: 1.6;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    position: relative;
  }
  
  .a4-page-container {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto 20px;
    padding: 15mm;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: visible;
    page-break-after: always;
    page-break-inside: avoid;
  }
  
  /* Content inside A4 pages should flow properly */
  .a4-page-container > * {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .chart-container,
  .section-with-charts {
    clear: both;
    margin-bottom: 20px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  /* Remove excessive spacing and ensure proper flow */
  .a4-page-container > * + * {
    margin-top: 15px;
  }

  /* Ensure headings have proper spacing */
  .a4-page-container h1,
  .a4-page-container h2,
  .a4-page-container h3 {
    margin-top: 15px !important;
    margin-bottom: 10px !important;
  }

  .temperature-gauges-section {
    clear: both;
    margin: 15px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: space-between;
    width: 100%;
  }
  
  .temperature-comparison-section {
    margin: 15px 0;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .temperature-comparison-section h3 {
    text-align: center;
    margin-bottom: 15px;
    color: #0A435C;
    font-size: 16px;
    font-weight: 600;
  }
  
  .temperature-comparison-section .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  @media (min-width: 768px) {
    .temperature-comparison-section .grid {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
  }
  
  .temperature-comparison-section .grid > * {
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .chart-container {
    page-break-inside: avoid;
    margin: 15px 0;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid rgba(10, 67, 92, 0.08);
    transition: box-shadow 0.3s ease;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .chart-container:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  
  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 12px;
    text-align: center;
    position: relative;
    padding-bottom: 8px;
  }
  
  .chart-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(to right, #2E936E, #7CDBD5);
    border-radius: 2px;
  }
  
  .temperature-gauge {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0;
    page-break-inside: avoid;
  }
  
  .gauge-container {
    text-align: center;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    border: 1px solid rgba(10, 67, 92, 0.1);
    transition: transform 0.2s ease;
    width: 240px;
    overflow: hidden;
  }
  
  .gauge-container h4 {
    margin: 0 0 10px 0;
    padding: 0;
  }
  
  .gauge-container > div {
    max-width: 100% !important;
    overflow: hidden;
  }
  
  .gauge-container .plotly-graph-div {
    max-width: 100% !important;
    overflow: hidden;
  }
  
  .gauge-container:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0,0,0,0.12);
  }
  
  .gauge-value {
    font-size: 36px;
    font-weight: 700;
    margin: 8px 0;
  }
  
  .gauge-change {
    font-size: 14px;
    color: #1D7AA3;
    margin: 6px 0;
    font-weight: 600;
    text-align: center;
    background: rgba(29, 122, 163, 0.1);
    padding: 3px 8px;
    border-radius: 12px;
    display: inline-block;
  }
  
  .gauge-label {
    font-size: 14px;
    font-weight: 600;
    color: #0A435C;
    margin: 6px 0;
  }
  
  .gauge-description {
    font-size: 12px;
    color: #64748B;
  }
  
  .roi-chart-container {
    page-break-inside: avoid;
    margin: 20px 0;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 1px solid #F8FAFC;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .section-with-charts {
    page-break-inside: avoid;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 15px 0;
    page-break-inside: avoid;
    width: 100%;
  }
  
  @media (min-width: 600px) {
    .chart-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  .single-chart {
    page-break-inside: avoid;
    margin: 15px 0;
    width: 100%;
  }
  
  .cover-page {
    background: white;
    color: #2D3B45;
    min-height: 25cm;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .header-section {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .company-logo {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .company-logo img {
    max-width: 200px;
    height: auto;
  }
  
  .tagline-banner {
    background: #0A435C;
    color: white;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 40px;
    box-shadow: 0 2px 10px rgba(10, 67, 92, 0.3);
  }
  
  .title-section {
    text-align: center;
    margin-bottom: 60px;
  }
  
  .main-title {
    font-size: 36px;
    font-weight: 700;
    color: #0A435C;
    margin-bottom: 15px;
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    font-size: 20px;
    font-weight: 500;
    color: #1D7AA3;
    margin-bottom: 30px;
  }
  
  .client-info {
    font-size: 22px;
    font-weight: 600;
    color: #2D3B45;
    margin-bottom: 8px;
  }
  
  .client-location {
    font-size: 16px;
    color: #64748B;
    margin-bottom: 30px;
  }
  
  .intelligent-solution-badge {
    background: #2E936E;
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 40px;
    box-shadow: 0 2px 8px rgba(46, 147, 110, 0.3);
  }
  
  .tech-section {
    margin-bottom: 40px;
  }
  
  .tech-section h3 {
    font-size: 20px;
    font-weight: 600;
    color: #0A435C;
    text-align: center;
    margin-bottom: 8px;
  }
  
  .tech-description {
    font-size: 14px;
    color: #64748B;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .tech-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .tech-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .tech-card-icon {
    width: 60px;
    height: 60px;
    background: #F0F9FF;
    border: 2px solid #1D7AA3;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 24px;
    color: #1D7AA3;
  }
  
  .tech-card h4 {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 10px;
  }
  
  .tech-card p {
    font-size: 13px;
    color: #64748B;
    line-height: 1.4;
    margin-bottom: 15px;
  }
  
  .tech-tags {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .tech-tag {
    background: #E0F2FE;
    color: #1D7AA3;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .footer-section {
    border-top: 1px solid #E2E8F0;
    padding-top: 20px;
    text-align: right;
  }
  
  .prepared-for {
    font-size: 14px;
    color: #0A435C;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .date-line {
    font-size: 14px;
    color: #64748B;
    margin-bottom: 10px;
  }
  
  .note-line {
    font-size: 12px;
    color: #64748B;
    font-style: italic;
    line-height: 1.3;
  }
  
  .toc-page {
    background: white;
    color: #2D3B45;
    min-height: 25cm;
    padding: 60px 25px;
  }
  
  .toc-title {
    font-size: 28px;
    font-weight: 600;
    color: #0A435C;
    text-align: center;
    margin-bottom: 50px;
    padding-bottom: 20px;
    border-bottom: 2px solid #E2E8F0;
  }
  
  .toc-content {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .toc-section {
    margin-bottom: 25px;
  }
  
  .toc-main-item {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 12px;
    padding-left: 20px;
    position: relative;
  }
  
  .toc-main-item::before {
    content: attr(data-number);
    position: absolute;
    left: 0;
    font-weight: 700;
    color: #1D7AA3;
  }
  
  .toc-sub-item {
    font-size: 14px;
    color: #64748B;
    margin-bottom: 8px;
    padding-left: 60px;
    position: relative;
  }
  
  .toc-sub-item::before {
    content: attr(data-number);
    position: absolute;
    left: 40px;
    font-weight: 500;
    color: #64748B;
  }
  
  .executive-summary-page {
    background: white;
    color: #2D3B45;
    min-height: 25cm;
    padding: 60px 25px;
  }
  
  .section-header {
    font-size: 24px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 3px solid #1D7AA3;
    position: relative;
  }
  
  .section-header::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 50px;
    height: 3px;
    background: #2E936E;
  }
  
  .executive-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2D3B45;
    margin-bottom: 25px;
    text-align: justify;
  }
  
  .metrics-table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    overflow: hidden;
    font-family: 'Inter', 'Arial', sans-serif;
  }
  
  .metrics-table thead {
    background: #0A435C;
    color: white;
  }
  
  .metrics-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .metrics-table td {
    padding: 14px 20px;
    border-bottom: 1px solid #E2E8F0;
    font-size: 14px;
  }
  
  .metrics-table tbody tr:nth-child(even) {
    background: #F8F9FA;
  }
  
  .metrics-table tbody tr:hover {
    background: #E0F2FE;
  }
  
  .metric-name {
    font-weight: 500;
    color: #2D3B45;
  }
  
  .metric-value {
    font-weight: 600;
    color: #0A435C;
  }
  
  .professional-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 24px 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .professional-table thead {
    background: #0A435C;
    color: white;
  }
  
  .professional-table th {
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.3px;
    border-bottom: 2px solid #1D7AA3;
  }
  
  .professional-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #E2E8F0;
    font-size: 14px;
  }
  
  .professional-table tbody tr:nth-child(even) {
    background: rgba(248, 250, 252, 0.6);
  }
  
  .professional-table tbody tr:hover {
    background: rgba(224, 242, 254, 0.5);
  }
  
  .change-positive {
    color: #2E936E;
    font-weight: 600;
  }
  
  .change-negative {
    color: #B23A48;
    font-weight: 600;
  }
  
  .closing-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2D3B45;
    margin-top: 25px;
    text-align: justify;
  }
  
  .system-description-page {
    background: white;
    color: #2D3B45;
    min-height: 25cm;
    padding: 60px 25px;
  }
  
  .section-title {
    font-size: 22px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #1D7AA3;
  }
  
  .subsection-title {
    font-size: 18px;
    font-weight: 600;
    color: #0A435C;
    margin: 30px 0 15px 0;
  }
  
  .description-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2D3B45;
    margin-bottom: 20px;
    text-align: justify;
  }
  
  .bullet-list {
    margin: 20px 0;
    padding-left: 20px;
  }
  
  .bullet-list li {
    font-size: 14px;
    line-height: 1.6;
    color: #2D3B45;
    margin-bottom: 8px;
  }
  
  .component-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  
  .component-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .component-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .component-icon {
    width: 40px;
    height: 40px;
    background: #E0F2FE;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 20px;
    color: #1D7AA3;
  }
  
  .component-title {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
  }
  
  .component-description {
    font-size: 13px;
    line-height: 1.5;
    color: #64748B;
    margin-bottom: 15px;
  }
  
  .component-features {
    margin: 0;
    padding-left: 20px;
  }
  
  .component-features li {
    font-size: 12px;
    line-height: 1.4;
    color: #2D3B45;
    margin-bottom: 5px;
  }
  
  .parameters-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .parameters-table thead {
    background: #0A435C;
    color: white;
  }
  
  .parameters-table th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
  }
  
  .parameters-table td {
    padding: 10px 15px;
    border-bottom: 1px solid #E2E8F0;
    font-size: 13px;
  }
  
  .parameters-table tbody tr:nth-child(even) {
    background: #F8F9FA;
  }
  
  .change-positive {
    color: #2E936E;
    font-weight: 600;
  }
  
  .change-negative {
    color: #B23A48;
    font-weight: 600;
  }
  
  .gauge-comparison {
    display: flex;
    justify-content: space-around;
    margin: 40px 0;
    gap: 40px;
  }
  
  .gauge-item {
    text-align: center;
    flex: 1;
  }
  
  .gauge-title {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 20px;
  }
  
  .gauge-section {
    margin: 30px 0;
  }
  
  .gauge-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0;
  }
  
  .gauge-container {
    text-align: center;
    flex: 1;
    margin: 0 20px;
  }
  
  .gauge-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 15px;
  }
  
  .gauge-chart-wrapper {
    position: relative;
    height: 200px;
    margin: 0 auto;
    max-width: 250px;
  }
  
  .gauge-chart-container {
    width: 100%;
    height: 100%;
  }
  
  .gauge-value {
    font-size: 32px;
    font-weight: 700;
    fill: #0A435C;
  }
  
  .gauge-change {
    font-size: 16px;
    font-weight: 600;
    fill: #2E936E;
  }
  
  .temperature-gauges-section {
    margin: 30px 0;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .gauge-headers {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .gauge-header {
    text-align: center;
    flex: 1;
  }
  
  .gauge-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 5px;
  }
  
  .gauge-header p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
  }
  
  .gauge-charts {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 20px;
  }
  
  .gauge-chart-wrapper {
    flex: 1;
    text-align: center;
  }
  
  .gauge-scale {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 30px;
  }
  
  .scale-label {
    font-size: 12px;
    color: #64748B;
    font-weight: 500;
  }
  
  .gauge-temperature {
    font-size: 32px;
    font-weight: 700;
    fill: #0A435C;
    dominant-baseline: middle;
  }
  
  .gauge-change {
    font-size: 16px;
    font-weight: 600;
    fill: #2E936E;
    dominant-baseline: middle;
  }
  
  .gauge-footer {
    text-align: center;
    padding-top: 15px;
    border-top: 1px solid #E5E7EB;
  }
  
  .gauge-footer-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .temperature-reduction {
    font-size: 14px;
    font-weight: 600;
    color: #2E936E;
  }
  
  .efficiency-text {
    font-size: 13px;
    color: #64748B;
  }
  
  .gauge-chart {
    width: 200px;
    height: 120px;
    margin: 0 auto;
    position: relative;
  }
  
  .gauge-value-display {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 28px;
    font-weight: 700;
    color: #0A435C;
  }
  
  .gauge-change {
    font-size: 14px;
    font-weight: 600;
    color: #2E936E;
    margin-top: 10px;
  }
  
  .cycle-comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .cycle-comparison-table thead {
    background: #0A435C;
    color: white;
  }
  
  .cycle-comparison-table th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
  }
  
  .cycle-comparison-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #E2E8F0;
    font-size: 13px;
    line-height: 1.4;
  }
  
  .cycle-comparison-table tbody tr:nth-child(even) {
    background: #F8F9FA;
  }
  
  .cycle-label {
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 5px;
  }
  
  .cycle-oem {
    background: #E3F2FD;
    color: #1976D2;
  }
  
  .cycle-actual {
    background: #FFF3E0;
    color: #F57C00;
  }
  
  .cycle-optimized {
    background: #E8F5E8;
    color: #388E3C;
  }
  
  .technical-diagram {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 20px 0;
  }
  
  .main-title {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
    opacity: 0.9;
  }
  
  .gradient-bar {
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #2E936E, #7CDBD5);
    margin: 20px auto;
    border-radius: 2px;
  }
  
  .client-info {
    font-size: 22px;
    font-weight: 600;
    margin: 20px 0;
  }
  
  .client-location {
    font-size: 18px;
    font-weight: 400;
    opacity: 0.8;
  }
  
  .tech-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    margin: 10px 5px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .section-header {
    font-size: 24px;
    color: #0A435C;
    margin-bottom: 20px;
    font-weight: 600;
    border-bottom: 2px solid #1D7AA3;
    padding-bottom: 8px;
  }
  
  .executive-summary {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #2D3B45;
  }
  
  .key-benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
    width: 100%;
  }
  
  .benefit-card {
    background: #FFFFFF;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 3px solid #2E936E;
    border: 1px solid #F8FAFC;
  }
  
  .benefit-icon {
    font-size: 20px;
    color: #2E936E;
    margin-bottom: 8px;
    display: block;
  }
  
  .benefit-title {
    font-size: 14px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 6px;
  }
  
  .benefit-description {
    font-size: 12px;
    color: #64748B;
    line-height: 1.3;
  }
  
  .section-header {
    font-size: 20px;
    color: #0A435C;
    margin-bottom: 15px;
    font-weight: 600;
    border-bottom: 2px solid #1D7AA3;
    padding-bottom: 6px;
  }
  
  .executive-summary {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
    color: #2D3B45;
  }
  
  .section-intro {
    margin-bottom: 20px;
    line-height: 1.6;
    color: #2D3B45;
    font-size: 13px;
    padding: 0 8px;
    border-left: 3px solid #1D7AA3;
  }

  .bullet-list {
    list-style: none;
    padding-left: 5px;
    margin: 15px 0;
  }
  
  .bullet-list li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 10px;
    line-height: 1.4;
    font-size: 13px;
  }
  
  .bullet-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    width: 14px;
    height: 14px;
    background-color: #2E936E;
    border-radius: 50%;
    opacity: 0.8;
  }
  
  .bullet-list li::after {
    content: '✓';
    position: absolute;
    left: 3px;
    top: 2px;
    color: white;
    font-size: 10px;
    font-weight: bold;
  }
  
  .bullet-title {
    color: #0A435C;
    font-weight: 600;
  }
  
  .bullet-detail {
    color: #64748B;
    font-weight: normal;
  }
  
  .section-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #0A435C;
    color: white;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    position: relative;
    overflow: hidden;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
  }
  
  .stat-value {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
    position: relative;
    z-index: 1;
  }
  
  .stat-label {
    font-size: 11px;
    opacity: 0.9;
    position: relative;
    z-index: 1;
    line-height: 1.2;
  }
  
  .professional-table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 1px solid #F8FAFC;
    box-sizing: border-box;
    font-size: 13px;
  }
  
  .professional-table th {
    background: #0A435C;
    color: white;
    padding: 10px 8px;
    font-weight: 600;
    text-align: left;
    font-size: 12px;
    letter-spacing: 0.3px;
  }
  
  .professional-table td {
    padding: 8px;
    border-bottom: 1px solid #D9E2EC;
    color: #2D3B45;
    font-size: 12px;
    word-wrap: break-word;
  }
  
  .professional-table tr:nth-child(even) {
    background: #F8FAFC;
  }
  
  .professional-table tr:hover {
    background: #EBF8FF;
  }
  
  .timeline-section {
    margin: 30px 0;
  }
  
  .timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 1px solid #F8FAFC;
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #2E936E, #7CDBD5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    margin-right: 15px;
    font-size: 14px;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-title {
    font-size: 16px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 5px;
  }
  
  .timeline-description {
    font-size: 14px;
    color: #64748B;
  }
  
  .component-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    border-left: 4px solid #1D7AA3;
    border: 1px solid #F8FAFC;
  }
  
  .component-card h4 {
    color: #0A435C;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .component-card p {
    color: #2D3B45;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .component-card ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .component-card li {
    color: #64748B;
    margin-bottom: 4px;
  }
  
  .document-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #D9E2EC;
    text-align: center;
    color: #64748B;
    font-size: 12px;
  }
  
  @media print {
    .a4-page-container {
      box-shadow: none;
      margin: 0;
      page-break-after: always;
      height: 29.7cm;
      width: 21cm;
    }
    .print-button {
      display: none;
    }
    
    .cover-page {
      page-break-after: always;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: white;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  
  @page {
    size: A4;
    margin: 0;
  }
`;

// Enhanced Plotly Temperature Gauge Component matching Python Dash Implementation exactly
const PlotlyTemperatureGauge: React.FC<{ 
  value: number; 
  maxValue: number; 
  label: string; 
  color: string; 
  showChange?: boolean; 
  changeValue?: string;
  reference?: number;
}> = ({ value, maxValue, label, color, showChange, changeValue, reference }) => {
  // Calculate segments for the gauge based on total range
  const segment1 = maxValue * 0.5;  // Green-blue zone
  const segment2 = maxValue * 0.67; // Blue-yellow zone
  const segment3 = maxValue * 0.84; // Yellow-red zone
  
  // Delta calculation - either use provided reference or compute from changeValue
  const deltaRef = reference || (changeValue ? 
    value + Math.abs(parseFloat(changeValue?.replace('°C', '') || '0')) : 
    value);
  
  return (
    <div className="gauge-container">
      <Plot
        data={[{
          type: 'indicator',
          mode: 'gauge+number+delta',
          value: value,
          title: {
            text: label,
            font: { family: 'Inter, sans-serif', size: 12, color: '#0A435C' }
          },
          delta: showChange ? { 
            reference: deltaRef,
            decreasing: { color: '#2E936E' },
            increasing: { color: '#B23A48' },
            valueformat: '.1f',
            suffix: '°C',
            font: { family: 'Inter, sans-serif', color: '#2D3B45', size: 12 }
          } : undefined,
          gauge: {
            shape: 'angular',
            axis: { 
              range: [0, maxValue], 
              ticksuffix: '°C', 
              tickcolor: '#64748B', 
              tickfont: { size: 10 },
              tickwidth: 1,
              ticklen: 6
            },
            bar: { color, thickness: 0.6 },
            bgcolor: '#F8FAFC',
            borderwidth: 2,
            bordercolor: '#E2E8F0',
            steps: [
              { range: [0, segment1], color: '#c7e9b4' },
              { range: [segment1, segment2], color: '#7fcdbb' },
              { range: [segment2, segment3], color: '#fdae61' },
              { range: [segment3, maxValue], color: '#d73027' }
            ],
            threshold: {
              line: { color, width: 4 },
              thickness: 0.8,
              value: value
            }
          },
          number: { 
            suffix: '°C', 
            font: { 
              family: 'Inter, sans-serif', 
              size: 20, 
              color: '#2D3B45', 
              weight: 'bold' 
            },
            valueformat: '.1f'
          }
        }]}
        layout={{ 
          width: 200, 
          height: 200, 
          margin: { t: 25, b: 20, l: 20, r: 20 },
          font: { family: 'Inter, Montserrat, sans-serif' },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          annotations: showChange && changeValue ? [
            {
              text: changeValue,
              font: { size: 14, color: changeValue.includes('-') ? '#2E936E' : '#B23A48' },
              showarrow: false,
              x: 0.5,
              y: 0.85,
              xref: 'paper',
              yref: 'paper'
            }
          ] : []
        }}
        config={{ 
          displayModeBar: false, 
          responsive: true,
          staticPlot: true
        }}
      />
      {showChange && changeValue && <div className="gauge-change">{changeValue}</div>}
    </div>
  );
};

export interface ChillerProposalData {
  clientName: string;
  clientLocation: string;
  projectDate: string;
  chillerCapacity: string;
  chillerType: string;
  currentPower: string;
  expectedSaving: string;
  electricityRate: string;
  waterCost: string;
  projectCost: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

interface ChillerProposalTemplateProps {
  data: ChillerProposalData;
}

export const ChillerProposalTemplate: React.FC<ChillerProposalTemplateProps> = ({ data }) => {

  // Calculate derived values based on Python implementation
  const beforePowerKW = parseFloat(data.currentPower);
  const afterPowerKW = beforePowerKW * (1 - parseFloat(data.expectedSaving) / 100);
  const savingKW = beforePowerKW - afterPowerKW;
  
  // Annual calculations based on hours and rates
  // Matching values from the Python implementation's refrigeration_dash.py
  const workingHours = 24; // 24 hours per day
  const workingDays = 320; // 320 days per year, from constants.py
  const annualHours = workingHours * workingDays;
  
  const annualEnergySaving = savingKW * annualHours; // kWh/year
  const annualMonetarySaving = annualEnergySaving * parseFloat(data.electricityRate) / 100; // Convert rate from Rs/kWh
  
  // Water usage: 2.5 L/min = 2.5 * 60 = 150 L/hr (from business_logic.py)
  const waterUsageLittersPerHour = 2.5 * 60;
  const annualWaterUsageCubicMeters = waterUsageLittersPerHour * annualHours / 1000; // Convert L to m³
  const annualWaterCost = annualWaterUsageCubicMeters * parseFloat(data.waterCost);
  
  // Maintenance cost typically 2% of project cost (from business_logic.py)
  const projectCostValue = parseFloat(data.projectCost.replace(/,/g, ''));
  const annualMaintenanceCost = projectCostValue * 0.02;
  
  // Net savings and payback calculations
  const netAnnualSavings = annualMonetarySaving - annualWaterCost - annualMaintenanceCost;
  const annualSaving = (netAnnualSavings / 100000).toFixed(2); // In lakhs
  const paybackPeriod = (projectCostValue / netAnnualSavings).toFixed(1); // In years
  const paybackMonths = Math.round(parseFloat(paybackPeriod) * 12); // In months
  
  // Environmental calculations (from Python business_logic.py)
  const co2ReductionFactor = 0.82; // kg CO2 per kWh
  const co2Reduction = (annualEnergySaving * co2ReductionFactor / 1000).toFixed(1); // Tonnes of CO2
  
  // Chart data
  const powerComparisonData = [
    { name: 'Before Adiabatic Cooling', value: beforePowerKW, color: '#B23A48' },
    { name: 'After Adiabatic Cooling', value: afterPowerKW, color: '#2E936E' },
    { name: 'Power Savings', value: savingKW, color: '#1D7AA3' }
  ];
  
  const financialBreakdownData = [
    { name: 'Electricity Savings', value: annualMonetarySaving, color: '#2E936E' },
    { name: 'Water Costs', value: annualWaterCost, color: '#B23A48' },
    { name: 'Maintenance Costs', value: annualMaintenanceCost, color: '#F68D60' },
    { name: 'Net Savings', value: netAnnualSavings, color: '#1D7AA3' }
  ];
  
  // ROI Chart Data (showing payback over years)
  const roiData = [];
  for (let year = 0; year <= 10; year++) {
    const cumulativeSavings = netAnnualSavings * year;
    const initialInvestment = parseFloat(data.projectCost.replace(/,/g, ''));
    const netPosition = cumulativeSavings - initialInvestment;
    roiData.push({
      year: year,
      cumulativeSavings: cumulativeSavings,
      netPosition: netPosition,
      breakeven: netPosition >= 0
    });
  }
  
  // Temperature Gauge Data for shadcn charts
  const temperatureGaugeBeforeData = [{ name: 'temperature', value: 47.7, fill: '#B23A48' }];
  const temperatureGaugeAfterData = [{ name: 'temperature', value: 36.0, fill: '#2E936E' }];
  
  // Chart configurations for shadcn
  const temperatureChartConfig = {
    temperature: {
      label: "Temperature",
      color: "#B23A48",
    }
  } satisfies ChartConfig;
  
  const temperatureAfterChartConfig = {
    temperature: {
      label: "Temperature",
      color: "#2E936E",
    }
  } satisfies ChartConfig;
  
  const powerChartConfig = {
    before: {
      label: "Before Adiabatic Cooling",
      color: "#B23A48",
    },
    after: {
      label: "After Adiabatic Cooling",
      color: "#2E936E",
    },
    savings: {
      label: "Power Savings",
      color: "#1D7AA3",
    }
  } satisfies ChartConfig;
  
  const financialChartConfig = {
    savings: {
      label: "Electricity Savings",
      color: "#2E936E",
    },
    water: {
      label: "Water Costs",
      color: "#B23A48",
    },
    maintenance: {
      label: "Maintenance Costs",
      color: "#F68D60",
    },
    net: {
      label: "Net Savings",
      color: "#1D7AA3",
    }
  } satisfies ChartConfig;
  
  // Temperature Gauge Component
  const TemperatureGauge: React.FC<{ value: number; label: string; description: string; color: string }> = ({ value, label, description, color }) => (
    <div className="gauge-container">
      <div className="gauge-label">{label}</div>
      <div className="gauge-value" style={{ color: color }}>
        {value.toFixed(1)}°C
      </div>
      <div className="gauge-description">{description}</div>
    </div>
  );
  
  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: payload[0].color }}>
            {typeof payload[0].value === 'number' ? 
              `${payload[0].value.toFixed(1)} ${payload[0].unit || ''}` : 
              payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: proposalStyles }} />
      <div className="proposal-container">{/* Remove action buttons and ref */}
      
      {/* Cover Page */}
      <div className="a4-page-container">
        <div className="cover-page">
          {/* Header Section */}
          <div className="header-section">
            <div className="company-logo">
              <img src="/seetech_logo.jpeg" alt="SeeTech Logo" />
            </div>
            <div className="tagline-banner">
              Delivering Profits & Sustainability Together
            </div>
          </div>
          
          {/* Title Section */}
          <div className="title-section">
            <h1 className="main-title">
              Adiabatic Cooling System
            </h1>
            <p className="subtitle">
              for {data.chillerCapacity} TR
            </p>
            
            <div className="client-info">
              {data.clientName}
            </div>
            <div className="client-location">
              {data.clientLocation}
            </div>
            
            <div className="intelligent-solution-badge">
              INTELLIGENT SOLUTION
            </div>
          </div>
          
          {/* Technology Section */}
          <div className="tech-section">
            <h3>Powered by Advanced Technology</h3>
            <p className="tech-description">
              Harnessing cutting-edge engineering and smart systems to optimize efficiency
            </p>
            
            <div className="tech-cards">
              <div className="tech-card">
                <div className="tech-card-icon">
                  <i className="fas fa-project-diagram"></i>
                </div>
                <h4>Digital Twin Technology</h4>
                <p>
                  Our solution leverages digital twin technology to simulate and optimize system performance 
                  before implementation, ensuring maximum efficiency.
                </p>
                <div className="tech-tags">
                  <span className="tech-tag">Real-time</span>
                  <span className="tech-tag">Predictive</span>
                </div>
              </div>
              
              <div className="tech-card">
                <div className="tech-card-icon">
                  <i className="fas fa-wifi"></i>
                </div>
                <h4>IoT-Enabled Monitoring</h4>
                <p>
                  Real-time data collection and analysis through IoT sensors for performance optimization and 
                  predictive maintenance.
                </p>
                <div className="tech-tags">
                  <span className="tech-tag">Smart Control</span>
                  <span className="tech-tag">Cloud Connected</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Section */}
          <div className="footer-section">
            <div className="prepared-for">
              Prepared for: {data.clientName}
            </div>
            <div className="date-line">
              Date: {data.projectDate}
            </div>
            <div className="note-line">
              Note: This proposal is generated by the system with detailed energy calculations and technical analysis.
            </div>
          </div>
        </div>
      </div>
      
      {/* Table of Contents */}
      <div className="a4-page-container">
        <div className="toc-page">
          <h1 className="toc-title">Table of Contents</h1>
          
          <div className="toc-content">
            <div className="toc-section">
              <div className="toc-main-item" data-number="1.">Executive Summary</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="2.">Adiabatic Cooling Technology</div>
              <div className="toc-sub-item" data-number="2.1">Adiabatic Cooling Technology</div>
              <div className="toc-sub-item" data-number="2.2">System Components</div>
              <div className="toc-sub-item" data-number="2.3">Expected Operating Parameters</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="3.">Technical Analysis</div>
              <div className="toc-sub-item" data-number="3.1">P-H Chart Visualization</div>
              <div className="toc-sub-item" data-number="3.2">Energy Savings Analysis</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="4.">Financial Analysis</div>
              <div className="toc-sub-item" data-number="4.1">Cost Benefit Summary</div>
              <div className="toc-sub-item" data-number="4.2">Life Cycle Cost Analysis</div>
              <div className="toc-sub-item" data-number="4.3">Return on Investment Analysis</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="5.">Environmental Impact</div>
              <div className="toc-sub-item" data-number="5.1">Carbon Footprint Reduction</div>
              <div className="toc-sub-item" data-number="5.2">Sustainability Benefits</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="6.">Implementation</div>
              <div className="toc-sub-item" data-number="6.1">Project Timeline</div>
              <div className="toc-sub-item" data-number="6.2">Installation Process</div>
              <div className="toc-sub-item" data-number="6.3">Your Project Team</div>
            </div>
            
            <div className="toc-section">
              <div className="toc-main-item" data-number="7.">Maintenance Service & Conclusion</div>
              <div className="toc-sub-item" data-number="7.1">SEE-Tech Professional Maintenance Program</div>
              <div className="toc-sub-item" data-number="7.2">Conclusion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="a4-page-container">
        <div className="executive-summary-page">
          <h1 className="section-header">1. Executive Summary</h1>
          
          <div className="executive-text">
            <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
              {data.clientName}'s <strong>{data.chillerCapacity} TR {data.chillerType}</strong> currently operates with an average power 
              consumption of <strong>{data.currentPower} kW</strong>. Our detailed analysis using digital twin technology has revealed a significant 
              opportunity to reduce energy consumption through the implementation of <strong>advanced adiabatic cooling technology</strong>.
            </p>
            
            <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
              Our proposal recommends installing the <strong>SEE-Tech Adiabatic Cooling System</strong> specifically designed for your facility, which will 
              reduce condenser temperature by <strong>7°C (from 45°C to 38°C)</strong>. This temperature reduction directly translates to improved compressor 
              efficiency and reduced power consumption. Our proprietary digital twin simulations have validated these projections through detailed modeling of your 
              specific system under various operating conditions.
            </p>
            
            <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
              The system includes <strong>IoT-enabled monitoring and control</strong> that will ensure continuous optimization and verification of savings 
              throughout the year, adapting to seasonal variations and changing load conditions. Our remote monitoring center provides 24/7 oversight to 
              maintain optimal system performance.
            </p>
            
            <p style={{ marginBottom: '25px', fontWeight: '600', color: '#0A435C' }}>
              The implementation of this system is projected to deliver the following benefits:
            </p>
          </div>
          
          <table className="metrics-table">
            <thead>
              <tr>
                <th>METRIC</th>
                <th>VALUE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-name">Chiller Capacity</td>
                <td className="metric-value">{data.chillerCapacity} TR</td>
              </tr>
              <tr>
                <td className="metric-name">Working Days</td>
                <td className="metric-value">{workingDays} days</td>
              </tr>
              <tr>
                <td className="metric-name">Working Hours</td>
                <td className="metric-value">{workingHours} hours</td>
              </tr>
              <tr>
                <td className="metric-name">Current Power Consumption</td>
                <td className="metric-value">{data.currentPower} kW</td>
              </tr>
              <tr>
                <td className="metric-name">Optimized Power Consumption</td>
                <td className="metric-value">{afterPowerKW.toFixed(1)} kW</td>
              </tr>
              <tr>
                <td className="metric-name">Expected Power Reduction</td>
                <td className="metric-value">{data.expectedSaving}%</td>
              </tr>
              <tr>
                <td className="metric-name">Annual Energy Savings</td>
                <td className="metric-value">{annualEnergySaving.toLocaleString()} kWh/year</td>
              </tr>
              <tr>
                <td className="metric-name">Annual Cost Savings</td>
                <td className="metric-value">₹{netAnnualSavings.toLocaleString()} ({annualSaving} L)/year</td>
              </tr>
              <tr>
                <td className="metric-name">Annual Water Consumption</td>
                <td className="metric-value">{annualWaterUsageCubicMeters.toLocaleString()} m³/year</td>
              </tr>
              <tr>
                <td className="metric-name">Project Cost</td>
                <td className="metric-value">₹{data.projectCost}</td>
              </tr>
              <tr>
                <td className="metric-name">Simple Payback Period</td>
                <td className="metric-value">{paybackMonths} months</td>
              </tr>
              <tr>
                <td className="metric-name">Annual ROI</td>
                <td className="metric-value">{(100/parseFloat(paybackPeriod)).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
          
          <div className="closing-text">
            <p>
              The system's performance has been validated through detailed engineering analysis and digital twin 
              simulation, ensuring accurate projections and minimal risk. SEE-Tech Solutions also offers a comprehensive 
              maintenance package to ensure continued optimal performance.
            </p>
          </div>
        </div>
      </div>

      {/* System Description */}
      <div className="a4-page-container">
        <div className="system-description-page">
          <h1 className="section-title">2. System Description</h1>
          
          <h2 className="subsection-title">2.1 Adiabatic Cooling Technology</h2>
          
          <div className="description-text">
            <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
              Adiabatic cooling is a sophisticated energy-efficient method that leverages the principles of evaporative cooling to 
              significantly reduce the temperature of air entering the condenser. This advanced technology harnesses the natural 
              physical principle that when water evaporates, it absorbs heat from the surrounding air (latent heat of vaporization), 
              effectively lowering its temperature without requiring substantial mechanical energy input.
            </p>
            
            <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
              The SEE-Tech Adiabatic Cooling System creates a pre-cooling effect by passing air through specially designed wetted media 
              before it reaches the condenser coils. This process can reduce the incoming air temperature by up to 12°C compared to ambient 
              conditions, depending on the relative humidity and dry bulb temperature of the environment.
            </p>
            
            <p style={{ marginBottom: '20px' }}>
              For refrigeration and HVAC systems, this results in several quantifiable benefits:
            </p>
            
            <ul className="bullet-list">
              <li>
                <span className="bullet-title">Lower condenser inlet air temperature</span> 
                <span className="bullet-detail">- Reducing the thermal load on the system</span>
              </li>
              <li>
                <span className="bullet-title">Reduced condensing pressure</span> 
                <span className="bullet-detail">- Allowing the compressor to work against lower pressure differential</span>
              </li>
              <li>
                <span className="bullet-title">Decreased compressor work</span> 
                <span className="bullet-detail">- Lowering power consumption and extending equipment life</span>
              </li>
              <li>
                <span className="bullet-title">Improved system Coefficient of Performance (COP)</span> 
                <span className="bullet-detail">- From approximately 2.6 to 4.3 based on our calculations</span>
              </li>
              <li>
                <span className="bullet-title">Significant energy savings</span> 
                <span className="bullet-detail">- Typically 15-25% reduction in electricity consumption</span>
              </li>
            </ul>
          </div>
          
          <h2 className="subsection-title">2.2 System Components</h2>
          
          <div className="description-text">
            <p>
              Our adiabatic cooling system consists of the following high-quality components designed for 
              maximum efficiency and durability:
            </p>
          </div>
          
          <div className="component-cards">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-th-large"></i>
                </div>
                <div className="component-title">Media Pads</div>
              </div>
              <div className="component-description">
                High-efficiency cellulose pads with cross-fluted design for optimal water distribution and air contact
              </div>
              <ul className="component-features">
                <li>Cross-fluted design</li>
                <li>Long lifespan material</li>
                <li>Maximum cooling efficiency</li>
              </ul>
            </div>
            
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-tint"></i>
                </div>
                <div className="component-title">Water Distribution System</div>
              </div>
              <div className="component-description">
                Precision-engineered water delivery with efficient distribution headers and flow control mechanisms
              </div>
              <ul className="component-features">
                <li>Uniform water distribution</li>
                <li>Stainless steel construction</li>
                <li>Low-pressure operation</li>
              </ul>
            </div>
            
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-cog"></i>
                </div>
                <div className="component-title">Control System</div>
              </div>
              <div className="component-description">
                Advanced IoT-enabled controls for intelligent operation based on ambient conditions and system demand
              </div>
              <ul className="component-features">
                <li>Remote monitoring capability</li>
                <li>Adaptive control algorithms</li>
                <li>Predictive maintenance alerts</li>
              </ul>
            </div>
            
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-filter"></i>
                </div>
                <div className="component-title">Water Treatment</div>
              </div>
              <div className="component-description">
                Integrated water conditioning system to maintain optimal TDS levels (&lt;200 ppm) and prevent scaling
              </div>
              <ul className="component-features">
                <li>Automatic bleed-off system</li>
                <li>Anti-scaling technology</li>
                <li>Water quality monitoring</li>
              </ul>
            </div>
          </div>
          
          <h2 className="subsection-title">2.3 Expected Operating Parameters</h2>
          
          <div className="description-text">
            <p>
              The following table outlines the key system parameters before and after adiabatic cooling implementation, 
              highlighting the significant improvements in operating conditions:
            </p>
          </div>
          
          <table className="parameters-table">
            <thead>
              <tr>
                <th>PARAMETER</th>
                <th>BEFORE</th>
                <th>AFTER</th>
                <th>CHANGE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-name">Condenser Temperature</td>
                <td>45°C</td>
                <td>38°C</td>
                <td className="change-positive">-7°C</td>
              </tr>
              <tr>
                <td className="metric-name">System COP</td>
                <td>2.60</td>
                <td>4.30</td>
                <td className="change-positive">+1.70</td>
              </tr>
              <tr>
                <td className="metric-name">Power Consumption</td>
                <td>210.0 kW</td>
                <td>168.0 kW</td>
                <td className="change-positive">-20.0%</td>
              </tr>
            </tbody>
          </table>
          
          <h3 className="text-lg font-semibold text-center text-blue-900 mb-4 mt-6">Temperature Comparison: Before vs After</h3>
          
          <PlotlyTemperatureGauge
            value={45}
            maxValue={60}
            label="Before: Current Temperature"
            color="#B23A48"
            reference={38}
          />
          
          <PlotlyTemperatureGauge
            value={38}
            maxValue={60}
            label="After: Optimized Temperature"
            color="#2E936E"
            showChange={true}
            changeValue="-7°C"
            reference={45}
          />
        </div>
      </div>
      
      {/* Technical Analysis */}
      <div className="a4-page-container">
        <div className="system-description-page">
          <h1 className="section-title">3. Technical Analysis</h1>
          
          <h2 className="subsection-title">P-H Chart Analysis</h2>
          
          <div className="description-text">
            <p>
              The pressure-enthalpy (P-H) diagram below illustrates the refrigeration cycles under different 
              operating conditions and demonstrates the impact of our proposed adiabatic cooling system:
            </p>
          </div>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0A435C', margin: '25px 0 15px 0' }}>
            Refrigeration Cycle Comparison
          </h3>
          
          <table className="cycle-comparison-table">
            <thead>
              <tr>
                <th>CYCLE TYPE</th>
                <th>DESCRIPTION</th>
                <th>SIGNIFICANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="cycle-label cycle-oem">OEM Cycle</span>
                </td>
                <td>
                  Original equipment manufacturer's design cycle under ideal conditions
                </td>
                <td>
                  Represents baseline performance as per design specifications; optimal operating 
                  parameters established by manufacturer
                </td>
              </tr>
              <tr>
                <td>
                  <span className="cycle-label cycle-actual">Actual Cycle</span>
                </td>
                <td>
                  Current system performance under existing environmental conditions
                </td>
                <td>
                  Shows real-world performance deviation from design specifications; identifies 
                  efficiency losses and opportunities for improvement
                </td>
              </tr>
              <tr>
                <td>
                  <span className="cycle-label cycle-optimized">Optimized Cycle</span>
                </td>
                <td>
                  Projected performance with adiabatic cooling implementation
                </td>
                <td>
                  Demonstrates expected performance gains through condenser temperature 
                  reduction; quantifies energy savings potential
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Analysis Charts */}
      <div className="a4-page-container">
        <h1 className="section-header">Technical Analysis</h1>
        
        <div className="section-with-charts">
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            3.1 Performance Parameters
          </h2>
          <p>
            The following table outlines the key system parameters before and after adiabatic cooling implementation,
            highlighting the significant improvements in operating conditions:
          </p>
          
          <table className="professional-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Current Condition</th>
                <th>With Adiabatic Cooling</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ambient Air Temperature</td>
                <td>35°C (Peak)</td>
                <td>28°C (Effective)</td>
                <td>7°C Reduction</td>
              </tr>
              <tr>
                <td>Condensing Temperature</td>
                <td>45°C</td>
                <td>38°C</td>
                <td>7°C Reduction</td>
              </tr>
              <tr>
                <td>Power Consumption</td>
                <td>{data.currentPower} kW</td>
                <td>{(parseFloat(data.currentPower) * (1 - parseFloat(data.expectedSaving)/100)).toFixed(1)} kW</td>
                <td>{data.expectedSaving}% Reduction</td>
              </tr>
              <tr>
                <td>COP (Coefficient of Performance)</td>
                <td>4.2</td>
                <td>5.1</td>
                <td>21% Improvement</td>
              </tr>
            </tbody>
          </table>
          
          {/* Power Comparison Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Power Consumption Comparison</CardTitle>
              <CardDescription>
                Current vs Optimized power consumption with adiabatic cooling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={powerChartConfig} className="h-[300px]">
                <BarChart data={powerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#2E936E">
                    {powerComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Power reduction: {data.expectedSaving}% <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Significant improvement in energy efficiency
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            3.2 Energy Efficiency Analysis
          </h2>
          <p>
            The adiabatic cooling system operates on the principle of evaporative cooling, which is highly 
            effective in dry climates. The system's efficiency is directly proportional to the dry bulb 
            temperature and inversely proportional to the wet bulb temperature of the ambient air.
          </p>
          
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-slate-100">
              <div className="stat-value text-3xl font-bold text-blue-900 mb-2">85%</div>
              <div className="stat-label text-sm font-medium text-slate-600">Cooling Efficiency</div>
            </div>
            
            <div className="stat-card bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-slate-100">
              <div className="stat-value text-3xl font-bold text-blue-900 mb-2">0.8</div>
              <div className="stat-label text-sm font-medium text-slate-600">kW Water Pump</div>
            </div>
            
            <div className="stat-card bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-slate-100">
              <div className="stat-value text-3xl font-bold text-blue-900 mb-2">2.5</div>
              <div className="stat-label text-sm font-medium text-slate-600">L/min Water Flow</div>
            </div>
            
            <div className="stat-card bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-slate-100">
              <div className="stat-value text-3xl font-bold text-blue-900 mb-2">24/7</div>
              <div className="stat-label text-sm font-medium text-slate-600">Operation Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Analysis */}
      <div className="a4-page-container">
        <h1 className="section-header">Financial Analysis</h1>
        
        <div className="section-intro">
          <p>
            Our comprehensive financial analysis demonstrates the compelling return on investment that the SEE-Tech Adiabatic Cooling System 
            offers for {data.clientName}. The analysis is based on actual operational data, validated power consumption measurements, and 
            conservative estimates of savings potential.
          </p>
        </div>
        
        <div className="section-with-charts">
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <span className="section-number">4.1</span> Cost Benefit Summary</h2>
          
          <table className="professional-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Annual Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Current Power Consumption</td>
                <td>{data.currentPower}</td>
                <td>kW</td>
                <td>₹{(beforePowerKW * annualHours * parseFloat(data.electricityRate) / 100).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Power Savings</td>
                <td>{savingKW.toFixed(1)}</td>
                <td>kW</td>
                <td>₹{annualMonetarySaving.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
              </tr>
              <tr>
                <td>Water Consumption Cost</td>
                <td>2.5</td>
                <td>L/min</td>
                <td>₹{annualWaterCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
              </tr>
              <tr>
                <td>Maintenance Cost</td>
                <td>2</td>
                <td>% of Investment</td>
                <td>₹{annualMaintenanceCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
              </tr>
              <tr>
                <td><strong>Net Annual Savings</strong></td>
                <td><strong>{annualSaving}</strong></td>
                <td><strong>Lakhs</strong></td>
                <td><strong>₹{netAnnualSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
              </tr>
              <tr>
                <td><strong>Simple Payback Period</strong></td>
                <td><strong>{paybackMonths}</strong></td>
                <td><strong>Months</strong></td>
                <td><strong>ROI: {(100/parseFloat(paybackPeriod)).toFixed(1)}%</strong></td>
              </tr>
            </tbody>
          </table>
          
          {/* Financial Breakdown Pie Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Annual Financial Impact Breakdown</h3>
            <ChartContainer config={financialChartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={financialBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {financialBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value: any) => [`₹${(Number(value) / 1000).toFixed(0)}K`, 'Amount']}
                    labelFormatter={(label) => `${label}`}
                  />}
                />
                <Legend />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            4.2 Investment Summary & ROI Analysis
          </h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">₹{data.projectCost}</div>
              <div className="stat-label">Total Investment</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">₹{annualSaving}L</div>
              <div className="stat-label">Annual Savings</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{paybackPeriod}</div>
              <div className="stat-label">Years Payback</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{(100/parseFloat(paybackPeriod)).toFixed(1)}%</div>
              <div className="stat-label">Annual ROI</div>
            </div>
          </div>
          
          {/* ROI Chart */}
          <div className="roi-chart-container">
            <h3 className="chart-title">Return on Investment Over Time</h3>
            <ChartContainer config={powerChartConfig} className="h-[300px]">
              <BarChart data={roiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']} />} />
                <Bar dataKey="netPosition" fill="#1D7AA3">
                  {roiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.breakeven ? "#2E936E" : "#B23A48"} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          
          <p>
            Through reduced electricity consumption, the environmental benefits extend beyond immediate energy savings
            to contribute to broader sustainability goals.
          </p>
          
          <table className="professional-table">
            <thead>
              <tr>
                <th>Environmental Parameter</th>
                <th>Current</th>
                <th>After Implementation</th>
                <th>Annual Reduction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CO₂ Emissions</td>
                <td>{(beforePowerKW * annualHours * co2ReductionFactor / 1000).toFixed(1)} Tons</td>
                <td>{(afterPowerKW * annualHours * co2ReductionFactor / 1000).toFixed(1)} Tons</td>
                <td>{co2Reduction} Tons</td>
              </tr>
              <tr>
                <td>Energy Consumption</td>
                <td>{(beforePowerKW * annualHours / 1000).toFixed(0)} MWh</td>
                <td>{(afterPowerKW * annualHours / 1000).toFixed(0)} MWh</td>
                <td>{(annualEnergySaving / 1000).toFixed(0)} MWh</td>
              </tr>
              <tr>
                <td>Water Usage</td>
                <td>0 L/min</td>
                <td>2.5 L/min</td>
                <td>+{(annualWaterUsageCubicMeters / 1000).toFixed(1)} ML/year</td>
              </tr>
              <tr>
                <td>Equivalent Trees Planted</td>
                <td>-</td>
                <td>-</td>
                <td>{(parseFloat(co2Reduction) * 16).toFixed(0)} Trees</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            5.2 Sustainability Benefits
          </h2>
          
          <div className="key-benefits">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-globe" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Carbon Neutral Goals</div>
              <div className="benefit-description">
                Contributes significantly to corporate sustainability and carbon neutrality objectives
                through measurable emission reductions.
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-recycle" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Resource Efficiency</div>
              <div className="benefit-description">
                Optimal utilization of water resources with minimal waste through advanced
                water management systems.
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-trophy" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Green Certification</div>
              <div className="benefit-description">
                Supports LEED, IGBC, and other green building certification requirements
                for sustainable facility operations.
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-chart-bar" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">ESG Compliance</div>
              <div className="benefit-description">
                Enhances Environmental, Social, and Governance (ESG) scores through
                demonstrable environmental improvements.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="a4-page-container">
        <h1 className="section-header">Implementation Timeline</h1>
        
        <div>
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            6.1 Project Phases
          </h2>
          
          <div className="timeline-section">
            <div className="timeline-item">
              <div className="timeline-icon">1</div>
              <div className="timeline-content">
                <div className="timeline-title">Site Survey & Design (Week 1-2)</div>
                <div className="timeline-description">
                  Detailed site assessment, measurements, and custom system design based on specific requirements
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">2</div>
              <div className="timeline-content">
                <div className="timeline-title">Manufacturing & Quality Control (Week 3-6)</div>
                <div className="timeline-description">
                  Component manufacturing, quality testing, and pre-assembly at our facility
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">3</div>
              <div className="timeline-content">
                <div className="timeline-title">Installation & Integration (Week 7-8)</div>
                <div className="timeline-description">
                  On-site installation, system integration, and connection to existing chiller infrastructure
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">4</div>
              <div className="timeline-content">
                <div className="timeline-title">Commissioning & Testing (Week 9)</div>
                <div className="timeline-description">
                  System commissioning, performance testing, and optimization for peak efficiency
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">5</div>
              <div className="timeline-content">
                <div className="timeline-title">Training & Handover (Week 10)</div>
                <div className="timeline-description">
                  Operator training, documentation handover, and warranty activation
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#0A435C', fontSize: '20px', marginBottom: '15px' }}>
            6.2 Support & Maintenance
          </h2>
          
          <div className="key-benefits">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-tools" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">24/7 Support</div>
              <div className="benefit-description">
                Round-the-clock technical support with remote monitoring and diagnostic capabilities
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-mobile-alt" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Mobile App Control</div>
              <div className="benefit-description">
                Complete system control and monitoring through dedicated mobile application
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-wrench" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Preventive Maintenance</div>
              <div className="benefit-description">
                Scheduled maintenance program with predictive analytics for optimal performance
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-certificate" style={{ fontSize: '24px', color: '#2E936E', marginBottom: '10px' }}></i>
              </div>
              <div className="benefit-title">Performance Guarantee</div>
              <div className="benefit-description">
                Guaranteed energy savings with performance monitoring and optimization
              </div>
            </div>
          </div>
        </div>

        <div className="document-footer">
          <p>
            This proposal is valid for 30 days from the date of issue. For any queries or clarifications, 
            please contact {data.contactPerson} at {data.contactEmail} or {data.contactPhone}.
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>SeeTech Solutions Pvt. Ltd.</strong> | Energy Efficiency & Sustainability Solutions
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChillerProposalTemplate;

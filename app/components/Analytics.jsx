import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import React from "react";

/**
 * Vercel Analytics component for React Native/Expo.
 * This should be placed in your root layout file.
 */
const Analytics = () => {
  return <VercelAnalytics />;
};

export default Analytics;
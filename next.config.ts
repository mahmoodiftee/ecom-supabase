import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Existing domains converted to remotePatterns
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'vibegaming.com.bd',
      },
      {
        protocol: 'https',
        hostname: 'techdiversitybd.com',
      },
      {
        protocol: 'https',
        hostname: 'en.akkogear.com',
      },
      {
        protocol: 'https',
        hostname: 'nuphy.com',
      },
      {
        protocol: 'https',
        hostname: 'files.ekmcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'resource.logitechg.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'iqunix.store',
      },
      {
        protocol: 'https',
        hostname: 'keychron.de',
      },
      {
        protocol: 'https',
        hostname: 'massdrop-s3.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'mechkeys.com',
      },
      {
        protocol: 'https',
        hostname: 'images.evga.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'drop.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ultratech.com.bd',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Supabase configuration with path pattern
      {
        protocol: 'https',
        hostname: 'spsjngwuzxzoefusrdha.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
'use client';

import React, { useEffect, useState } from 'react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Show after slight scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const url = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage:
      'Hello JP Farms! 🐓 I found you on your website and want to inquire about your heritage roosters.',
  });

  if (!visible) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      title="WhatsApp JP Farms"
    >
      <MessageCircle className="w-6 h-6 text-white fill-white" />
    </a>
  );
};

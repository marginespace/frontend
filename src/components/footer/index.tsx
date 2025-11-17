'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import CookiePolicy from '@/ui/icons/cookie-policy';
import PrivacyPolicy from '@/ui/icons/privacy-policy';
import TermsConditions from '@/ui/icons/terms-conditions';
import Telegram from '@/ui/icons/telegram';
import X from '@/ui/icons/x';

export const Footer = () => {
  useEffect(() => {
    // Защита: загружаем виджет только в браузере
    if (typeof window === 'undefined') {
      return;
    }

    let script: HTMLScriptElement | null = null;
    let style: HTMLStyleElement | null = null;

    try {
      // Проверяем, не загружен ли уже скрипт
      const existingScript = document.querySelector(
        'script[src*="commonninja.js"]'
      );
      if (existingScript) {
        return;
      }

      // Создаем изолированный контейнер для стилей
      style = document.createElement('style');
      style.id = 'commonninja-widget-styles';
      style.innerHTML = `
        /* Изоляция CommonNinja popup widget */
        .commonninja_component {
          position: fixed !important;
          z-index: 9999 !important;
          isolation: isolate !important;
        }
        
        /* Кастомизация под красный дизайн */
        .commonninja_component iframe,
        .commonninja_component * {
          --primary-color: #FF4444 !important;
          --accent-color: #FF6B6B !important;
          --background-color: rgba(0, 0, 0, 0.95) !important;
        }
        
        /* Overlay backdrop */
        .commonninja-modal-overlay {
          background: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(4px) !important;
        }
        
        /* Кнопка закрытия - красная */
        .commonninja-close-button,
        .cn-close-btn {
          background: #FF4444 !important;
          color: white !important;
          border: 2px solid #FF6B6B !important;
          transition: all 0.3s ease !important;
        }
        
        .commonninja-close-button:hover,
        .cn-close-btn:hover {
          background: #FF6B6B !important;
          transform: scale(1.1) !important;
        }
        
        /* Кнопки внутри виджета */
        .commonninja_component button,
        .commonninja_component .cn-button {
          background: linear-gradient(135deg, #FF4444 0%, #FF6B6B 100%) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
        }
        
        .commonninja_component button:hover,
        .commonninja_component .cn-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4) !important;
        }
        
        /* Текст и заголовки */
        .commonninja_component h1,
        .commonninja_component h2,
        .commonninja_component h3 {
          color: #FF4444 !important;
        }
        
        /* Ссылки */
        .commonninja_component a {
          color: #FF6B6B !important;
        }
        
        .commonninja_component a:hover {
          color: #FF4444 !important;
        }

        /* Защита от влияния на основной контент */
        .commonninja_component {
          pointer-events: auto !important;
        }
        
        .commonninja_component ~ * {
          pointer-events: auto !important;
        }
      `;
      
      // Безопасно добавляем стили
      if (document.head) {
        document.head.appendChild(style);
      }

      // Создаем скрипт с обработкой ошибок
      script = document.createElement('script');
      script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
      script.defer = true;
      script.async = true;
      script.id = 'commonninja-widget-script';
      
      // Обработка ошибок загрузки
      script.onerror = (error) => {
        console.warn('CommonNinja widget failed to load:', error);
        // Не падаем, просто логируем
      };

      script.onload = () => {
        console.log('CommonNinja widget loaded successfully');
      };

      // Безопасно добавляем скрипт
      if (document.body) {
        document.body.appendChild(script);
      }
    } catch (error) {
      // Ловим любые ошибки и не даем им упасть фронтенд
      console.warn('Error initializing CommonNinja widget:', error);
    }

    return () => {
      // Безопасная очистка при размонтировании
      try {
        if (script?.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (style?.parentNode) {
          style.parentNode.removeChild(style);
        }
      } catch (error) {
        console.warn('Error cleaning up CommonNinja widget:', error);
      }
    };
  }, []);

  return (
    <>
      {/* CommonNinja Popup Widget - изолирован с error boundary */}
      {typeof window !== 'undefined' && (
        <div 
          className="commonninja_component pid-f0f8e061-66cb-44d6-a767-a594743b49a7"
          suppressHydrationWarning
          style={{
            isolation: 'isolate',
            contain: 'layout style paint',
          }}
        />
      )}
      
      <footer className="w-full mt-auto bg-linear-white py-4 px-4 text-[14px] font-semibold text-white shadow-[0_-6px_10px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:py-[16px] md:px-6">
        <div className="mx-auto max-w-[1400px]">
        {/* Mobile Layout: соцсети слева, копирайт по центру, иконки справа */}
        <div className="relative flex flex-row items-center justify-between gap-2 md:hidden">
          {/* Social Links - Left */}
          <div className="flex flex-row items-center gap-[10px] flex-shrink-0">
            <Link 
              href="https://x.com/margin_space" 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Follow us on X (Twitter)"
            >
              <X />
            </Link>
            <Link 
              href="https://t.me/marginspacesupportteam"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Contact support via Telegram"
            >
              <Telegram />
            </Link>
          </div>

          {/* Copyright - Center (absolute positioned) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center text-xs whitespace-nowrap">
            © 2025 Margin Space
          </div>

          {/* Legal Links Icons - Right */}
          <div className="flex flex-row items-center gap-3 flex-shrink-0">
            <Link 
              href="/privacy-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Privacy Policy"
            >
              <PrivacyPolicy className="h-5 w-5 text-white" />
            </Link>
            <Link 
              href="/terms-and-conditions"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Terms and Conditions"
            >
              <TermsConditions className="h-5 w-5 text-white" />
            </Link>
            <Link 
              href="/cookie-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Cookie Policy"
            >
              <CookiePolicy className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Social Links */}
          <div className="flex flex-row items-center gap-[10px]">
            <Link 
              href="https://x.com/margin_space" 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Follow us on X (Twitter)"
            >
              <X />
            </Link>
            <Link 
              href="https://t.me/marginspacesupportteam"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Contact support via Telegram"
            >
              <Telegram />
            </Link>
          </div>

          {/* Legal Links - Text on desktop */}
          <div className="flex flex-row items-center gap-6">
            <Link 
              href="/privacy-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-and-conditions"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Terms and Conditions
            </Link>
            <Link 
              href="/cookie-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-right">
            © 2025 Margin Space
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

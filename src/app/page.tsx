'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from(quoteRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
      });

      gsap.from(ctaRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.7,
        ease: 'power3.out',
      });

      gsap.from(cardsRef.current?.children || [], {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.9,
        ease: 'power3.out',
      });

      // Floating animation for the hero section
      gsap.to(heroRef.current, {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center" ref={heroRef}>
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Save Lives with{' '}
              <span className="text-red-600 inline-block">lifeLink</span>
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Connecting blood donors with recipients across Fiji. 
              Every drop counts, every connection matters.
            </p>

            <div
              ref={quoteRef}
              className="max-w-2xl mx-auto mb-10 p-6 bg-white/50 backdrop-blur rounded-2xl border border-red-100 shadow-lg"
            >
              <p className="text-lg italic text-gray-700">
                "The blood you donate gives someone another chance at life. 
                One day that someone may be a close relative, a friend, 
                a loved one—or even you."
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/find-donors"
                className="px-8 py-4 bg-red-600 text-white rounded-full text-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Find Blood Donors
              </Link>
              <Link
                href="/register-donor"
                className="px-8 py-4 bg-white text-red-600 rounded-full text-lg font-semibold border-2 border-red-600 hover:bg-red-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Become a Donor
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Find Donors
              </h3>
              <p className="text-gray-600">
                Search for blood donors by blood type, location, and availability. 
                Connect instantly when you need help.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Register as Donor
              </h3>
              <p className="text-gray-600">
                Join our community of life-savers. Register your blood type 
                and help those in need across Fiji.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Instant Notifications
              </h3>
              <p className="text-gray-600">
                Receive real-time notifications when someone needs your blood type. 
                Be a hero when it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-4">
              A Joint Initiative By
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Fiji Red Cross Society
                </span>
              </div>
              <span className="text-gray-400 hidden sm:block">•</span>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Government of Fiji
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">lifeLink</span>
              </div>
              <p className="text-gray-400">
                Connecting lives, one donation at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <p className="text-gray-400 mb-2">24/7 Blood Donation Helpline</p>
              <p className="text-xl font-bold text-red-500">132 (Toll Free)</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 lifeLink. A joint initiative by Fiji Red Cross Society and Government of Fiji.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

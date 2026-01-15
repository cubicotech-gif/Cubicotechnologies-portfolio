'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submission would be handled here!');
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl lg:text-6xl mb-6">Contact Us</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Let's discuss how we can help transform your educational vision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display font-bold text-2xl mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-white to-zinc-400 text-black font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl mb-4">Get in Touch</h3>
              <div className="space-y-4 text-zinc-400">
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <span>Karachi, Pakistan</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:info@cubico.tech" className="hover:text-white transition-colors">
                    info@cubico.tech
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <span>+92 XXX XXXXXXX</span>
                </p>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl mb-4">Office Hours</h3>
              <div className="space-y-2 text-zinc-400">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl lg:text-6xl mb-6">Our Services</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Comprehensive digital solutions for Islamic education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Professional Animation Production',
              description: 'Emmy-quality animations featuring Hollywood-level production values with deep Islamic scholarship.',
              icon: '🎬'
            },
            {
              title: 'Educational Content Creation',
              description: 'World-class curriculum development backed by Islamic scholarship and modern pedagogical research.',
              icon: '📚'
            },
            {
              title: 'Enterprise Web Development',
              description: 'Scalable, secure web platforms with 99.9% uptime and enterprise-grade solutions.',
              icon: '💻'
            },
            {
              title: 'Digital Transformation',
              description: 'Mobile apps, cloud infrastructure, and AI-powered learning tools for modern education.',
              icon: '📱'
            }
          ].map((service, i) => (
            <div key={i} className="glass rounded-3xl p-8 spotlight-card gradient-border hover:bg-white/5 transition-all">
              <div className="relative z-10">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="font-display font-bold text-2xl mb-3">{service.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

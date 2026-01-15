export default function Process() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl lg:text-6xl mb-6">Our Process</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A proven workflow that delivers exceptional results
          </p>
        </div>

        <div className="space-y-8">
          {[
            { step: 1, title: 'Discovery & Consultation', description: 'Understanding your vision and requirements' },
            { step: 2, title: 'Planning & Strategy', description: 'Creating a roadmap for success' },
            { step: 3, title: 'Design & Prototyping', description: 'Visualizing the solution' },
            { step: 4, title: 'Development & Production', description: 'Building with excellence' },
            { step: 5, title: 'Review & Refinement', description: 'Perfecting every detail' },
            { step: 6, title: 'Delivery & Launch', description: 'Going live with confidence' },
            { step: 7, title: 'Ongoing Support', description: 'Long-term partnership' }
          ].map((item) => (
            <div key={item.step} className="glass rounded-2xl p-8 spotlight-card gradient-border hover:bg-white/5 transition-all">
              <div className="relative z-10 flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center font-display font-bold text-2xl text-black">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

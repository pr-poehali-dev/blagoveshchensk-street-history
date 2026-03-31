import { useState, useEffect, useCallback } from 'react';

const STREETS_URL = 'https://functions.poehali.dev/89188024-4032-43c3-93e4-d68bf30880f6';

interface Street {
  id: number;
  name: string;
  era: string;
  year: string;
  description: string;
}

const Index = () => {
  const [streets, setStreets] = useState<Street[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStreets = useCallback(async (q: string) => {
    setLoading(true);
    const url = q ? `${STREETS_URL}?search=${encodeURIComponent(q)}` : STREETS_URL;
    const res = await fetch(url);
    const data = await res.json();
    setStreets(data.streets || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchStreets(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchStreets]);

  return (
    <div className="min-h-screen font-golos bg-[#f5f2ee]">
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#f5f2ee]/90 backdrop-blur-sm border-b border-[#ddd8d0]">
        <span className="font-cormorant text-xl font-semibold tracking-wide text-[#2c2820]">
          Улицы Благовещенска
        </span>
        <div className="flex gap-8">
          <a href="#" className="text-sm text-[#2c2820] hover:text-[#8b6f47] transition-colors">Главная</a>
          <a href="#streets" className="text-sm text-[#2c2820] hover:text-[#8b6f47] transition-colors">Улицы</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <img
          src="https://cdn.poehali.dev/projects/c8be0153-dee9-4e57-b5b1-f6d9a1a92601/bucket/191ddb4d-9b9d-46f8-9b9c-30f0048cfeef.jpg"
          alt="Набережная Благовещенска"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        <div className="relative h-full flex flex-col justify-end pb-20 px-8 md:px-16 max-w-5xl">
          <p className="text-[#e8d5b0] font-golos text-sm tracking-[0.2em] uppercase mb-4 animate-fade-in opacity-0" style={{animationDelay: '0.2s'}}>
            Благовещенск · Амурская область
          </p>
          <h1 className="font-cormorant text-5xl md:text-7xl font-medium text-white leading-[1.1] mb-6 animate-fade-in opacity-0" style={{animationDelay: '0.4s'}}>
            История города<br />
            <em>вокруг нас</em>
          </h1>
          <p className="text-white/80 font-golos text-lg max-w-xl leading-relaxed mb-10 animate-fade-in opacity-0" style={{animationDelay: '0.6s'}}>
            Каждая улица Благовещенска хранит свою историю. Узнайте, в честь кого и почему были названы улицы нашего города.
          </p>
          <a
            href="#streets"
            className="inline-flex items-center gap-3 w-fit bg-white/10 backdrop-blur border border-white/30 text-white px-7 py-3.5 text-sm tracking-wide hover:bg-white/20 transition-all duration-300 animate-fade-in opacity-0"
            style={{animationDelay: '0.8s'}}
          >
            Исследовать улицы
            <span className="text-[#e8d5b0]">→</span>
          </a>
        </div>
      </section>

      {/* Секция улиц */}
      <section id="streets" className="py-20 px-8 md:px-16 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[#8b6f47] text-sm tracking-[0.15em] uppercase mb-2">Каталог</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-[#2c2820]">Улицы города</h2>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти улицу..."
              className="w-full border border-[#ddd8d0] bg-white px-4 py-3 pl-10 text-sm text-[#2c2820] placeholder-[#b0a898] focus:outline-none focus:border-[#8b6f47] transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a898] text-base">⌕</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-[#b0a898] font-golos text-sm tracking-wide">Загрузка...</span>
          </div>
        ) : streets.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-[#b0a898] font-golos text-sm tracking-wide">Улицы не найдены</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#ddd8d0]">
            {streets.map((street, i) => (
              <div
                key={street.id}
                className="bg-[#f5f2ee] p-8 hover:bg-white transition-colors duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[#b0a898] text-xs tracking-widest font-golos">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[#8b6f47] text-xs tracking-wide uppercase font-golos">{street.era}</span>
                </div>
                <h3 className="font-cormorant text-2xl font-medium text-[#2c2820] mb-3 group-hover:text-[#8b6f47] transition-colors">
                  {street.name}
                </h3>
                <p className="text-[#6b6259] text-sm leading-relaxed line-clamp-3 font-golos">
                  {street.description}
                </p>
                <div className="mt-6 pt-4 border-t border-[#ddd8d0]">
                  <span className="text-xs text-[#b0a898] font-golos">Названа в {street.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Подвал */}
      <footer className="border-t border-[#ddd8d0] py-10 px-8 text-center">
        <p className="font-cormorant text-lg text-[#8b6f47] italic mb-1">Благовещенск</p>
        <p className="text-xs text-[#b0a898] font-golos tracking-wide">Основан в 1858 году</p>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const STREETS_URL = 'https://functions.poehali.dev/89188024-4032-43c3-93e4-d68bf30880f6';

interface Street {
  id: number;
  name: string;
  era: string;
  year: string;
  description: string;
}

const StreetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [street, setStreet] = useState<Street | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStreet = async () => {
      setLoading(true);
      const res = await fetch(`${STREETS_URL}?id=${id}`);
      const data = await res.json();
      if (res.status === 404 || !data.street) {
        setNotFound(true);
      } else {
        setStreet(data.street);
      }
      setLoading(false);
    };
    fetchStreet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2ee] flex items-center justify-center">
        <span className="text-[#b0a898] font-golos text-sm tracking-wide">Загрузка...</span>
      </div>
    );
  }

  if (notFound || !street) {
    return (
      <div className="min-h-screen bg-[#f5f2ee] flex flex-col items-center justify-center gap-4">
        <p className="font-cormorant text-3xl text-[#2c2820]">Улица не найдена</p>
        <button onClick={() => navigate('/')} className="text-sm text-[#8b6f47] underline underline-offset-4">
          Вернуться к каталогу
        </button>
      </div>
    );
  }

  const paragraphs = street.description.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f5f2ee] font-golos">
      {/* Шапка */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#f5f2ee]/90 backdrop-blur-sm border-b border-[#ddd8d0]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-[#2c2820] hover:text-[#8b6f47] transition-colors"
        >
          ← Все улицы
        </button>
        <span className="font-cormorant text-xl font-semibold tracking-wide text-[#2c2820]">
          Улицы Благовещенска
        </span>
      </nav>

      {/* Контент */}
      <main className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
        {/* Метка эпохи */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[#8b6f47] text-xs tracking-[0.2em] uppercase border border-[#8b6f47]/30 px-3 py-1">
            {street.era}
          </span>
          <span className="text-[#b0a898] text-xs font-golos">Названа в {street.year} году</span>
        </div>

        {/* Заголовок */}
        <h1 className="font-cormorant text-5xl md:text-6xl font-medium text-[#2c2820] leading-[1.1] mb-12">
          {street.name}
        </h1>

        {/* Разделитель */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#ddd8d0]" />
          <span className="text-[#b0a898] text-xs tracking-widest">ИСТОРИЯ</span>
          <div className="h-px flex-1 bg-[#ddd8d0]" />
        </div>

        {/* Текст */}
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[#3d3530] text-lg leading-[1.8] font-golos">
              {p}
            </p>
          ))}
        </div>

        {/* Кнопка назад */}
        <div className="mt-20 pt-8 border-t border-[#ddd8d0]">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 text-sm text-[#2c2820] hover:text-[#8b6f47] transition-colors tracking-wide"
          >
            ← Вернуться к каталогу улиц
          </button>
        </div>
      </main>

      {/* Подвал */}
      <footer className="border-t border-[#ddd8d0] py-10 px-8 text-center">
        <p className="font-cormorant text-lg text-[#8b6f47] italic mb-1">Благовещенск</p>
        <p className="text-xs text-[#b0a898] font-golos tracking-wide">Основан в 1858 году</p>
      </footer>
    </div>
  );
};

export default StreetDetail;

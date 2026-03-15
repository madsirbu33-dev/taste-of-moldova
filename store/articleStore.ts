import { create } from 'zustand';

export interface Article {
  id: string;
  title: string;
  category: string;
  time: string;
  image: string;
  content: string;
  author: string;
  date: string;
}

interface ArticleState {
  articles: Article[];
}

export const useArticleStore = create<ArticleState>(() => ({
  articles: [
    {
      id: '1',
      title: 'Arta Divinului',
      category: 'Patrimoniu',
      time: '5 min lectură',
      image: 'https://images.unsplash.com/photo-1510850402280-d23a1f7c8993?auto=format&fit=crop&w=800&q=80',
      author: 'Echipa Taste of Moldova',
      date: '15 Martie 2026',
      content: `Divinul este mândria națională a Republicii Moldova. Această băutură nobilă, echivalentă cu coniacul, este produsă prin dubla distilare a vinului și maturarea în butoaie de stejar timp de cel puțin 3 ani.\n\nSimbolismul "Copacul Vieții" de pe etichetele noastre reprezintă rădăcinile adânci ale tradiției noastre vinicole și ramurile care se întind spre viitor. Divinul moldovenesc este recunoscut global pentru nuanțele sale de ambră, aromele complexe de flori, vanilie și ciocolată, oferind o experiență senzorială unică. În Moldova, producția de Divin este protejată prin Indicația Geografică Protejată (IGP DIVIN), garantând calitatea și autenticitatea fiecărei sticle.`
    },
    {
        id: '2',
        title: 'Tradiția Wine Heritage',
        category: 'Cultură',
        time: '4 min lectură',
        image: 'https://images.unsplash.com/photo-1566733971257-82650294114b?auto=format&fit=crop&w=800&q=80',
        author: 'Specialist ONT',
        date: '12 Martie 2026',
        content: `Cultura vinului în Moldova depășește simpla agricultură; este un mod de viață. De la legendele berzei care a salvat cetatea Soroca aducând struguri, până la cele mai mari beciuri subterane din lume, vinul este firul roșu al istoriei noastre.\n\nFiecare regiune IGP aduce propriul caracter: Codrul oferă prospețime și arome florale, Ștefan Vodă aduce intensitate și forță, în timp ce Valul lui Traian surprinde prin complexitate și soare. Vizitând vinăriile noastre, nu deguști doar un produs, ci o întreagă moștenire culturală transmisă din generație în generație.`
    }
  ]
}));

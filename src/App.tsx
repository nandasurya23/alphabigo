import React from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { AppHeader } from '@/components/layout/AppHeader';
import { HeroShowcaseSection } from '@/components/layout/HeroShowcaseSection';
import { CockpitGrid } from '@/components/calculator/CockpitGrid';
import { NotePentingCard } from '@/components/common/NotePentingCard';
import { AppFooter } from '@/components/layout/AppFooter';

export const App: React.FC = () => {
  const calculator = useCalculator();

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="main-content">
        <HeroShowcaseSection />
        <CockpitGrid calculator={calculator} />
        <NotePentingCard />
      </main>
      <AppFooter />
    </div>
  );
};

export default App;

'use client';

import { useState, useRef } from 'react';

// Game categories
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🎮' },
  { id: 'arcade', name: 'Arcade', icon: '👾' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
  { id: 'sport', name: 'Sport', icon: '⚽' },
  { id: 'action', name: 'Action', icon: '💥' },
  { id: 'casual', name: 'Casual', icon: '🎯' },
];

// Featured games (large cards)
const FEATURED_GAMES = [
  { id: 1, name: 'Ocean Quest', image: '🌊', description: 'Explore the deep sea', category: 'arcade' },
  { id: 2, name: 'Fish Frenzy', image: '🐠', description: 'Catch colorful fish', category: 'action' },
];

// Trending games list
const TRENDING_GAMES = [
  { id: 1, name: 'Coral Match', icon: '🪸', description: 'Match corals to win big rewards!', category: 'puzzle' },
  { id: 2, name: 'Shark Run', icon: '🦈', description: 'Escape from hungry sharks!', category: 'action' },
  { id: 3, name: 'Treasure Dive', icon: '🏴‍☠️', description: 'Dive deep for hidden treasures', category: 'arcade' },
  { id: 4, name: 'Shell Collector', icon: '🐚', description: 'Collect rare shells on the beach', category: 'casual' },
  { id: 5, name: 'Wave Rider', icon: '🏄', description: 'Surf the biggest waves!', category: 'sport' },
  { id: 6, name: 'Jellyfish Pop', icon: '🎐', description: 'Pop jellyfish bubbles fast!', category: 'puzzle' },
  { id: 7, name: 'Crab Race', icon: '🦀', description: 'Race crabs on the sandy beach', category: 'sport' },
  { id: 8, name: 'Pearl Hunter', icon: '🦪', description: 'Find precious pearls underwater', category: 'arcade' },
  { id: 9, name: 'Dolphin Jump', icon: '🐬', description: 'Jump through hoops with dolphins!', category: 'action' },
  { id: 10, name: 'Starfish Puzzle', icon: '⭐', description: 'Solve starfish puzzles', category: 'puzzle' },
  { id: 11, name: 'Whale Watch', icon: '🐋', description: 'Spot whales in the ocean', category: 'casual' },
  { id: 12, name: 'Octopus Escape', icon: '🐙', description: 'Help octopus escape the maze', category: 'arcade' },
  { id: 13, name: 'Turtle Race', icon: '🐢', description: 'Race sea turtles to the finish', category: 'sport' },
  { id: 14, name: 'Seahorse Sprint', icon: '🦑', description: 'Sprint through underwater caves', category: 'action' },
  { id: 15, name: 'Anchor Drop', icon: '⚓', description: 'Drop anchors to catch fish', category: 'casual' },
];

export function GameScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);
  const [categoryStartX, setCategoryStartX] = useState(0);
  const [categoryScrollLeft, setCategoryScrollLeft] = useState(0);

  const filteredGames = selectedCategory === 'all' 
    ? TRENDING_GAMES 
    : TRENDING_GAMES.filter(game => game.category === selectedCategory);

  const handlePlayGame = (gameName: string) => {
    alert(`Starting ${gameName}...`);
  };

  // Handle mouse wheel scroll for horizontal carousel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      e.preventDefault();
      carouselRef.current.scrollLeft += e.deltaY;
    }
  };

  // Handle mouse wheel scroll for categories
  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (categoryRef.current) {
      e.preventDefault();
      categoryRef.current.scrollLeft += e.deltaY;
    }
  };

  // Drag to scroll for carousel
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Drag to scroll for categories
  const handleCategoryMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoryRef.current) return;
    setIsCategoryDragging(true);
    setCategoryStartX(e.pageX - categoryRef.current.offsetLeft);
    setCategoryScrollLeft(categoryRef.current.scrollLeft);
  };

  const handleCategoryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCategoryDragging || !categoryRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryRef.current.offsetLeft;
    const walk = (x - categoryStartX) * 1.5;
    categoryRef.current.scrollLeft = categoryScrollLeft - walk;
  };

  const handleCategoryMouseUp = () => {
    setIsCategoryDragging(false);
  };

  const handleCategoryMouseLeave = () => {
    setIsCategoryDragging(false);
  };

  return (
    <div className="flex flex-col" style={{ paddingTop: 'clamp(12px, 3vw, 18px)', backgroundColor: 'transparent', height: '100%', overflow: 'hidden' }}>
      {/* Categories Filter */}
      <div 
        ref={categoryRef}
        onWheel={handleCategoryWheel}
        onMouseDown={handleCategoryMouseDown}
        onMouseMove={handleCategoryMouseMove}
        onMouseUp={handleCategoryMouseUp}
        onMouseLeave={handleCategoryMouseLeave}
        className="flex hide-scrollbar"
        style={{ 
          overflowX: 'auto', 
          paddingLeft: 'clamp(8px, 2vw, 12px)', 
          paddingRight: 'clamp(8px, 2vw, 12px)',
          paddingBottom: 'clamp(8px, 2vw, 12px)',
          marginBottom: 'clamp(10px, 2.5vw, 14px)',
          WebkitOverflowScrolling: 'touch',
          cursor: isCategoryDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          gap: 'clamp(6px, 1.5vw, 10px)',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex items-center whitespace-nowrap transition-all"
            style={{
              background: selectedCategory === cat.id 
                ? 'linear-gradient(135deg, #ffffff, #e8dcc8)' 
                : 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(232,220,200,0.6))',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#1a1a2e',
              fontSize: 'var(--fs-sm)',
              fontWeight: selectedCategory === cat.id ? '600' : '400',
              padding: 'clamp(5px, 1.2vw, 7px) clamp(10px, 2.5vw, 14px)',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              gap: 'clamp(4px, 1vw, 6px)',
            }}
          >
            <span style={{ fontSize: 'var(--fs-sm)' }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Featured Games Carousel */}
      <div style={{ paddingLeft: 'clamp(8px, 2vw, 12px)', paddingRight: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(12px, 3vw, 16px)' }}>
        <div 
          ref={carouselRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex pb-2 hide-scrollbar" 
          style={{ 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            gap: 'clamp(10px, 2.5vw, 16px)',
          }}
        >  {FEATURED_GAMES.map((game) => (
            <div
              key={game.id}
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                width: 'clamp(150px, 42vw, 200px)',
                height: 'clamp(85px, 24vw, 115px)',
                borderRadius: 'clamp(10px, 2.5vw, 14px)',
                background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              {/* Game Image/Icon */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ fontSize: 'clamp(32px, 10vw, 48px)', opacity: 0.4 }}
              >
                {game.image}
              </div>
              
              {/* Bottom Info */}
              <div 
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                  borderRadius: '0 0 clamp(8px, 2vw, 12px) clamp(8px, 2vw, 12px)',
                  padding: 'clamp(6px, 1.5vw, 10px)',
                }}
              >
                <div className="flex items-center" style={{ gap: 'clamp(4px, 1vw, 8px)' }}>
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: 'clamp(20px, 6vw, 28px)',
                      height: 'clamp(20px, 6vw, 28px)',
                      borderRadius: 'clamp(5px, 1.2vw, 8px)',
                      background: 'rgba(255,255,255,0.25)',
                      fontSize: 'var(--fs-base)',
                    }}
                  >
                    {game.image}
                  </div>
                  <span className="font-bold" style={{ fontSize: 'var(--fs-sm)', color: '#1a1a2e' }}>{game.name}</span>
                </div>
                <button
                  onClick={() => handlePlayGame(game.name)}
                  className="font-bold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1a1a2e',
                    fontSize: 'var(--fs-sm)',
                    boxShadow: '0 4px 15px rgba(255,200,0,0.3)',
                    padding: 'clamp(4px, 1vw, 6px) clamp(10px, 2.5vw, 14px)',
                    borderRadius: 'clamp(4px, 1vw, 6px)',
                  }}
                >
                  PLAY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Games Section */}
      <div 
        className="hide-scrollbar"
        style={{ 
          paddingLeft: 'clamp(8px, 2vw, 12px)', 
          paddingRight: 'clamp(8px, 2vw, 12px)',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
          maxHeight: 'calc(100vh - clamp(220px, 55vw, 300px))',
          paddingBottom: 'clamp(60px, 16vw, 80px)',
        }}
      >  <div className="flex items-center justify-between" style={{ marginBottom: 'clamp(6px, 1.5vw, 10px)' }}>
          <h2 className="font-bold" style={{ fontSize: 'var(--fs-base)', color: '#1a1a2e' }}>Trending games</h2>
          <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 'var(--fs-sm)', cursor: 'pointer' }}>View all</span>
        </div>

        {/* Games List */}
        <div className="flex flex-col" style={{ gap: 'clamp(8px, 2vw, 10px)' }}>
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px) clamp(8px, 2vw, 12px) clamp(8px, 2vw, 12px)',
                gap: 'clamp(8px, 2vw, 12px)',
              }}
            >
              {/* Game Icon */}
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 'clamp(32px, 9vw, 42px)',
                  height: 'clamp(32px, 9vw, 42px)',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(232,220,200,0.5))',
                  fontSize: 'var(--fs-lg)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
                }}
              >
                {game.icon}
              </div>

              {/* Game Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold" style={{ fontSize: 'var(--fs-base)', marginBottom: 'clamp(1px, 0.3vw, 2px)', color: '#1a1a2e' }}>
                  {game.name}
                </h3>
                <p 
                  className="truncate"
                  style={{ fontSize: 'var(--fs-sm)', color: 'rgba(0,0,0,0.6)' }}
                >
                  {game.description}
                </p>
              </div>

              {/* Play Button */}
              <button
                onClick={() => handlePlayGame(game.name)}
                className="font-bold transition-all hover:scale-105 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#1a1a2e',
                  fontSize: 'var(--fs-sm)',
                  boxShadow: '0 4px 15px rgba(255,200,0,0.3)',
                  padding: 'clamp(5px, 1.2vw, 7px) clamp(10px, 2.5vw, 14px)',
                  borderRadius: 'clamp(4px, 1vw, 6px)',
                  marginRight: 'clamp(2px, 0.5vw, 4px)',
                }}
              >
                PLAY
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameScreen;

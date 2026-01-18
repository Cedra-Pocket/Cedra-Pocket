// Test script to verify pet image paths are correct
// Run this in browser console to test all zodiac animals and levels

const ZODIAC_ANIMALS = [
  { id: 'rat', name: 'Rat', emoji: '🐀', nameVi: 'Tý', image: 'mouse', hasLevels: true },
  { id: 'ox', name: 'Ox', emoji: '🐂', nameVi: 'Sửu', image: 'buff', hasLevels: true },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', nameVi: 'Dần', image: 'tiger', hasLevels: true },
  { id: 'cat', name: 'Cat', emoji: '🐱', nameVi: 'Mão', image: 'cat', hasLevels: true },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', nameVi: 'Thìn', image: 'dragon', hasLevels: true },
  { id: 'snake', name: 'Snake', emoji: '🐍', nameVi: 'Tỵ', image: 'snake', hasLevels: true },
  { id: 'horse', name: 'Horse', emoji: '🐴', nameVi: 'Ngọ', image: 'horse', hasLevels: true },
  { id: 'goat', name: 'Goat', emoji: '🐐', nameVi: 'Mùi', image: 'goat', hasLevels: true },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', nameVi: 'Thân', image: 'monkey', hasLevels: true },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', nameVi: 'Dậu', image: 'chicken', hasLevels: true },
  { id: 'dog', name: 'Dog', emoji: '🐕', nameVi: 'Tuất', image: 'dog', hasLevels: true },
  { id: 'pig', name: 'Pig', emoji: '🐷', nameVi: 'Hợi', image: 'pig', hasLevels: true },
];

const getPetImage = (zodiac, level) => {
  if (zodiac.hasLevels) {
    const imgLevel = Math.ceil(level / 2);
    
    const getExtension = (animalImage, level) => {
      const pngCases = [
        'mouse1', 'chicken1', 'dog3', 'horse2', 'horse5', 'pig3', 'pig4', 'snake3', 'snake4', 'tiger'
      ];
      
      const fileName = `${animalImage}${level}`;
      return pngCases.includes(fileName) ? '.png' : '.PNG';
    };
    
    const extension = getExtension(zodiac.image, imgLevel);
    return `/pet/${zodiac.image}${imgLevel}${extension}`;
  }
  return `/pet/${zodiac.image}`;
};

// Test all animals and levels
console.log('=== Pet Image Path Test ===');
ZODIAC_ANIMALS.forEach(zodiac => {
  console.log(`\n${zodiac.name} (${zodiac.image}):`);
  for (let level = 1; level <= 10; level++) {
    const imagePath = getPetImage(zodiac, level);
    console.log(`  Level ${level}: ${imagePath}`);
  }
});

// Test specific year calculations
console.log('\n=== Year to Zodiac Test ===');
const getZodiacFromYear = (year) => {
  const index = (year - 1900) % 12;
  const adjustedIndex = index < 0 ? index + 12 : index;
  return ZODIAC_ANIMALS[adjustedIndex];
};

const testYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020];
testYears.forEach(year => {
  const zodiac = getZodiacFromYear(year);
  console.log(`${year}: ${zodiac.name} (${zodiac.nameVi})`);
});
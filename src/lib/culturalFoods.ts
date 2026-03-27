export interface CulturalFood {
  id: string;
  name_en: string;
  name_es: string;
  category: string;
  origin: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving_size: string;
  serving_size_es: string;
}

export const culturalFoods: CulturalFood[] = [
  { id: 'cf1', name_en: 'Arroz con Pollo', name_es: 'Arroz con Pollo', category: 'main', origin: 'Latin America', calories: 420, protein: 28, carbs: 48, fat: 12, fiber: 2, serving_size: '1 cup (250g)', serving_size_es: '1 taza (250g)' },
  { id: 'cf2', name_en: 'Pupusas (cheese)', name_es: 'Pupusas (queso)', category: 'main', origin: 'El Salvador', calories: 230, protein: 9, carbs: 26, fat: 10, fiber: 2, serving_size: '1 pupusa (120g)', serving_size_es: '1 pupusa (120g)' },
  { id: 'cf3', name_en: 'Pupusas (pork & cheese)', name_es: 'Pupusas (chicharrón y queso)', category: 'main', origin: 'El Salvador', calories: 280, protein: 12, carbs: 26, fat: 14, fiber: 2, serving_size: '1 pupusa (130g)', serving_size_es: '1 pupusa (130g)' },
  { id: 'cf4', name_en: 'Tamales (pork)', name_es: 'Tamales (cerdo)', category: 'main', origin: 'Mexico / Central America', calories: 310, protein: 13, carbs: 30, fat: 16, fiber: 3, serving_size: '1 tamale (150g)', serving_size_es: '1 tamal (150g)' },
  { id: 'cf5', name_en: 'Tamales (chicken)', name_es: 'Tamales (pollo)', category: 'main', origin: 'Mexico / Central America', calories: 270, protein: 15, carbs: 28, fat: 12, fiber: 3, serving_size: '1 tamale (150g)', serving_size_es: '1 tamal (150g)' },
  { id: 'cf6', name_en: 'Empanadas (beef)', name_es: 'Empanadas (carne)', category: 'main', origin: 'Latin America', calories: 320, protein: 14, carbs: 28, fat: 17, fiber: 1, serving_size: '1 empanada (130g)', serving_size_es: '1 empanada (130g)' },
  { id: 'cf7', name_en: 'Empanadas (chicken)', name_es: 'Empanadas (pollo)', category: 'main', origin: 'Latin America', calories: 280, protein: 16, carbs: 28, fat: 12, fiber: 1, serving_size: '1 empanada (130g)', serving_size_es: '1 empanada (130g)' },
  { id: 'cf8', name_en: 'Gallo Pinto', name_es: 'Gallo Pinto', category: 'main', origin: 'Costa Rica / Nicaragua', calories: 260, protein: 10, carbs: 42, fat: 6, fiber: 7, serving_size: '1 cup (200g)', serving_size_es: '1 taza (200g)' },
  { id: 'cf9', name_en: 'Ceviche', name_es: 'Ceviche', category: 'main', origin: 'Peru / Latin America', calories: 180, protein: 22, carbs: 12, fat: 5, fiber: 2, serving_size: '1 cup (200g)', serving_size_es: '1 taza (200g)' },
  { id: 'cf10', name_en: 'Tacos al Pastor', name_es: 'Tacos al Pastor', category: 'main', origin: 'Mexico', calories: 220, protein: 14, carbs: 20, fat: 10, fiber: 2, serving_size: '2 tacos (160g)', serving_size_es: '2 tacos (160g)' },
  { id: 'cf11', name_en: 'Enchiladas (chicken)', name_es: 'Enchiladas (pollo)', category: 'main', origin: 'Mexico', calories: 350, protein: 20, carbs: 30, fat: 16, fiber: 4, serving_size: '2 enchiladas (250g)', serving_size_es: '2 enchiladas (250g)' },
  { id: 'cf12', name_en: 'Pozole Rojo', name_es: 'Pozole Rojo', category: 'soup', origin: 'Mexico', calories: 300, protein: 22, carbs: 28, fat: 12, fiber: 5, serving_size: '1 bowl (350g)', serving_size_es: '1 plato (350g)' },
  { id: 'cf13', name_en: 'Sopa de Frijoles Negros', name_es: 'Sopa de Frijoles Negros', category: 'soup', origin: 'Latin America', calories: 220, protein: 14, carbs: 36, fat: 4, fiber: 12, serving_size: '1 bowl (300g)', serving_size_es: '1 plato (300g)' },
  { id: 'cf14', name_en: 'Chilaquiles', name_es: 'Chilaquiles', category: 'breakfast', origin: 'Mexico', calories: 380, protein: 16, carbs: 34, fat: 20, fiber: 4, serving_size: '1 plate (250g)', serving_size_es: '1 plato (250g)' },
  { id: 'cf15', name_en: 'Huevos Rancheros', name_es: 'Huevos Rancheros', category: 'breakfast', origin: 'Mexico', calories: 340, protein: 18, carbs: 28, fat: 18, fiber: 5, serving_size: '1 plate (280g)', serving_size_es: '1 plato (280g)' },
  { id: 'cf16', name_en: 'Platanos Maduros (fried)', name_es: 'Plátanos Maduros (fritos)', category: 'side', origin: 'Latin America / Caribbean', calories: 220, protein: 1, carbs: 38, fat: 8, fiber: 3, serving_size: '1 cup (150g)', serving_size_es: '1 taza (150g)' },
  { id: 'cf17', name_en: 'Yuca Frita', name_es: 'Yuca Frita', category: 'side', origin: 'Latin America', calories: 280, protein: 2, carbs: 42, fat: 12, fiber: 3, serving_size: '1 cup (150g)', serving_size_es: '1 taza (150g)' },
  { id: 'cf18', name_en: 'Frijoles Refritos', name_es: 'Frijoles Refritos', category: 'side', origin: 'Mexico', calories: 200, protein: 12, carbs: 28, fat: 5, fiber: 10, serving_size: '1 cup (200g)', serving_size_es: '1 taza (200g)' },
  { id: 'cf19', name_en: 'Guacamole', name_es: 'Guacamole', category: 'side', origin: 'Mexico', calories: 160, protein: 2, carbs: 9, fat: 14, fiber: 6, serving_size: '1/2 cup (100g)', serving_size_es: '1/2 taza (100g)' },
  { id: 'cf20', name_en: 'Pico de Gallo', name_es: 'Pico de Gallo', category: 'side', origin: 'Mexico', calories: 25, protein: 1, carbs: 5, fat: 0, fiber: 1, serving_size: '1/4 cup (60g)', serving_size_es: '1/4 taza (60g)' },
  { id: 'cf21', name_en: 'Tres Leches Cake', name_es: 'Pastel de Tres Leches', category: 'dessert', origin: 'Latin America', calories: 350, protein: 8, carbs: 48, fat: 14, fiber: 0, serving_size: '1 slice (150g)', serving_size_es: '1 rebanada (150g)' },
  { id: 'cf22', name_en: 'Churros', name_es: 'Churros', category: 'dessert', origin: 'Spain / Latin America', calories: 240, protein: 3, carbs: 30, fat: 12, fiber: 1, serving_size: '3 churros (100g)', serving_size_es: '3 churros (100g)' },
  { id: 'cf23', name_en: 'Flan', name_es: 'Flan', category: 'dessert', origin: 'Latin America', calories: 260, protein: 7, carbs: 38, fat: 9, fiber: 0, serving_size: '1 slice (130g)', serving_size_es: '1 porción (130g)' },
  { id: 'cf24', name_en: 'Horchata', name_es: 'Horchata', category: 'drink', origin: 'Mexico / Central America', calories: 150, protein: 1, carbs: 32, fat: 3, fiber: 0, serving_size: '1 glass (240ml)', serving_size_es: '1 vaso (240ml)' },
  { id: 'cf25', name_en: 'Agua de Jamaica', name_es: 'Agua de Jamaica', category: 'drink', origin: 'Mexico', calories: 90, protein: 0, carbs: 22, fat: 0, fiber: 0, serving_size: '1 glass (240ml)', serving_size_es: '1 vaso (240ml)' },
  { id: 'cf26', name_en: 'Mole Poblano with Chicken', name_es: 'Mole Poblano con Pollo', category: 'main', origin: 'Mexico', calories: 400, protein: 30, carbs: 22, fat: 22, fiber: 4, serving_size: '1 plate (300g)', serving_size_es: '1 plato (300g)' },
  { id: 'cf27', name_en: 'Arepas (cheese)', name_es: 'Arepas (queso)', category: 'main', origin: 'Venezuela / Colombia', calories: 250, protein: 8, carbs: 30, fat: 11, fiber: 2, serving_size: '1 arepa (150g)', serving_size_es: '1 arepa (150g)' },
  { id: 'cf28', name_en: 'Bandeja Paisa', name_es: 'Bandeja Paisa', category: 'main', origin: 'Colombia', calories: 780, protein: 42, carbs: 68, fat: 36, fiber: 10, serving_size: '1 plate (500g)', serving_size_es: '1 plato (500g)' },
  { id: 'cf29', name_en: 'Lomo Saltado', name_es: 'Lomo Saltado', category: 'main', origin: 'Peru', calories: 450, protein: 32, carbs: 38, fat: 18, fiber: 3, serving_size: '1 plate (350g)', serving_size_es: '1 plato (350g)' },
  { id: 'cf30', name_en: 'Curtido (cabbage slaw)', name_es: 'Curtido', category: 'side', origin: 'El Salvador', calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 2, serving_size: '1/2 cup (80g)', serving_size_es: '1/2 taza (80g)' },
  { id: 'cf31', name_en: 'Sopa de Res', name_es: 'Sopa de Res', category: 'soup', origin: 'Central America', calories: 280, protein: 24, carbs: 30, fat: 8, fiber: 5, serving_size: '1 bowl (400g)', serving_size_es: '1 plato (400g)' },
  { id: 'cf32', name_en: 'Arroz con Leche', name_es: 'Arroz con Leche', category: 'dessert', origin: 'Latin America', calories: 200, protein: 5, carbs: 36, fat: 4, fiber: 0, serving_size: '1 cup (200g)', serving_size_es: '1 taza (200g)' },
  { id: 'cf33', name_en: 'Tostones', name_es: 'Tostones', category: 'side', origin: 'Caribbean / Latin America', calories: 180, protein: 1, carbs: 32, fat: 6, fiber: 2, serving_size: '6 pieces (120g)', serving_size_es: '6 piezas (120g)' },
  { id: 'cf34', name_en: 'Quesadilla', name_es: 'Quesadilla', category: 'main', origin: 'Mexico', calories: 310, protein: 14, carbs: 26, fat: 16, fiber: 1, serving_size: '1 quesadilla (160g)', serving_size_es: '1 quesadilla (160g)' },
  { id: 'cf35', name_en: 'Birria Tacos', name_es: 'Tacos de Birria', category: 'main', origin: 'Mexico', calories: 380, protein: 22, carbs: 24, fat: 22, fiber: 2, serving_size: '3 tacos (240g)', serving_size_es: '3 tacos (240g)' },
  { id: 'cf36', name_en: 'Elote (street corn)', name_es: 'Elote', category: 'side', origin: 'Mexico', calories: 200, protein: 5, carbs: 28, fat: 8, fiber: 3, serving_size: '1 ear (160g)', serving_size_es: '1 elote (160g)' },
  { id: 'cf37', name_en: 'Sancocho', name_es: 'Sancocho', category: 'soup', origin: 'Latin America / Caribbean', calories: 320, protein: 26, carbs: 34, fat: 10, fiber: 5, serving_size: '1 bowl (400g)', serving_size_es: '1 plato (400g)' },
  { id: 'cf38', name_en: 'Chiles Rellenos', name_es: 'Chiles Rellenos', category: 'main', origin: 'Mexico', calories: 340, protein: 16, carbs: 22, fat: 20, fiber: 3, serving_size: '2 chiles (250g)', serving_size_es: '2 chiles (250g)' },
  { id: 'cf39', name_en: 'Pastelitos (meat)', name_es: 'Pastelitos (carne)', category: 'main', origin: 'Honduras / Caribbean', calories: 290, protein: 10, carbs: 30, fat: 14, fiber: 1, serving_size: '2 pastelitos (140g)', serving_size_es: '2 pastelitos (140g)' },
  { id: 'cf40', name_en: 'Baleadas', name_es: 'Baleadas', category: 'main', origin: 'Honduras', calories: 350, protein: 14, carbs: 40, fat: 14, fiber: 8, serving_size: '1 baleada (200g)', serving_size_es: '1 baleada (200g)' },
];

export const getCulturalFoodsByCategory = (category: string): CulturalFood[] => {
  return culturalFoods.filter(food => food.category === category);
};

export const searchCulturalFoods = (query: string, lang: 'en' | 'es' = 'en'): CulturalFood[] => {
  const q = query.toLowerCase();
  return culturalFoods.filter(food => {
    const name = lang === 'es' ? food.name_es : food.name_en;
    return name.toLowerCase().includes(q) || food.origin.toLowerCase().includes(q);
  });
};

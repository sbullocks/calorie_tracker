// Foods are organized by category.
// Items marked [V] are vegan. Non-vegan items are kept for the non-vegan user
// but vegan alternatives are included alongside them.

export const FOODS = [
  // Fruits
  { name: 'Apple', cal: 95, vegan: true },
  { name: 'Banana', cal: 105, vegan: true },
  { name: 'Orange', cal: 62, vegan: true },
  { name: 'Grapes (1 cup)', cal: 104, vegan: true },
  { name: 'Strawberries (1 cup)', cal: 49, vegan: true },
  { name: 'Blueberries (1 cup)', cal: 84, vegan: true },
  { name: 'Watermelon (2 cups)', cal: 85, vegan: true },
  { name: 'Mango (1 cup)', cal: 99, vegan: true },
  { name: 'Pineapple (1 cup)', cal: 82, vegan: true },

  // Vegetables
  { name: 'Broccoli (1 cup)', cal: 55, vegan: true },
  { name: 'Spinach (1 cup)', cal: 7, vegan: true },
  { name: 'Carrots (medium)', cal: 25, vegan: true },
  { name: 'Cucumber (1 cup)', cal: 16, vegan: true },
  { name: 'Kale (1 cup)', cal: 33, vegan: true },
  { name: 'Sweet potato (medium)', cal: 103, vegan: true },
  { name: 'Edamame (½ cup)', cal: 94, vegan: true },
  { name: 'Corn (1 cup)', cal: 132, vegan: true },
  { name: 'Bell pepper (medium)', cal: 31, vegan: true },
  { name: 'Zucchini (1 cup)', cal: 19, vegan: true },

  // Plant proteins
  { name: 'Tofu (100g)', cal: 76, vegan: true },
  { name: 'Tempeh (100g)', cal: 193, vegan: true },
  { name: 'Black beans (½ cup)', cal: 114, vegan: true },
  { name: 'Chickpeas (½ cup)', cal: 135, vegan: true },
  { name: 'Lentils (½ cup cooked)', cal: 115, vegan: true },
  { name: 'Kidney beans (½ cup)', cal: 112, vegan: true },
  { name: 'Pea protein shake', cal: 120, vegan: true },
  { name: 'Seitan (100g)', cal: 125, vegan: true },
  { name: 'Hummus (2 tbsp)', cal: 50, vegan: true },

  // Grains & carbs
  { name: 'Oatmeal (1 cup cooked)', cal: 166, vegan: true },
  { name: 'Brown rice (1 cup)', cal: 215, vegan: true },
  { name: 'White rice (1 cup)', cal: 206, vegan: true },
  { name: 'Quinoa (1 cup)', cal: 222, vegan: true },
  { name: 'Whole wheat bread (1 slice)', cal: 69, vegan: true },
  { name: 'Pasta (1 cup cooked)', cal: 220, vegan: true },
  { name: 'Granola (½ cup)', cal: 210, vegan: true },

  // Nuts, seeds & fats
  { name: 'Almonds (1oz)', cal: 164, vegan: true },
  { name: 'Walnuts (1oz)', cal: 185, vegan: true },
  { name: 'Cashews (1oz)', cal: 157, vegan: true },
  { name: 'Chia seeds (2 tbsp)', cal: 138, vegan: true },
  { name: 'Flaxseeds (2 tbsp)', cal: 110, vegan: true },
  { name: 'Peanut butter (2 tbsp)', cal: 190, vegan: true },
  { name: 'Almond butter (2 tbsp)', cal: 196, vegan: true },
  { name: 'Avocado (half)', cal: 120, vegan: true },
  { name: 'Olive oil (1 tbsp)', cal: 119, vegan: true },
  { name: 'Coconut milk (½ cup)', cal: 223, vegan: true },

  // Dairy-free alternatives
  { name: 'Oat milk (1 cup)', cal: 120, vegan: true },
  { name: 'Almond milk (1 cup)', cal: 39, vegan: true },
  { name: 'Soy milk (1 cup)', cal: 105, vegan: true },
  { name: 'Vegan yogurt (170g)', cal: 110, vegan: true },
  { name: 'Nutritional yeast (2 tbsp)', cal: 45, vegan: true },

  // Drinks & misc
  { name: 'Coffee (black)', cal: 5, vegan: true },
  { name: 'Green tea', cal: 2, vegan: true },
  { name: 'Orange juice (1 cup)', cal: 112, vegan: true },
  { name: 'Soda (12oz can)', cal: 140, vegan: true },
  { name: 'Salad (large, plain)', cal: 20, vegan: true },
  { name: 'Granola bar', cal: 190, vegan: true },

  // Non-vegan (for user 1)
  { name: 'Chicken breast (100g)', cal: 165, vegan: false },
  { name: 'Salmon fillet (100g)', cal: 208, vegan: false },
  { name: 'Tuna can (drained)', cal: 109, vegan: false },
  { name: 'Ground beef (100g)', cal: 254, vegan: false },
  { name: 'Turkey breast (100g)', cal: 135, vegan: false },
  { name: 'Shrimp (100g)', cal: 99, vegan: false },
  { name: 'Eggs (2 large)', cal: 140, vegan: false },
  { name: 'Egg white (1)', cal: 17, vegan: false },
  { name: 'Greek yogurt (170g)', cal: 100, vegan: false },
  { name: 'Cottage cheese (½ cup)', cal: 90, vegan: false },
  { name: 'Skim milk (1 cup)', cal: 83, vegan: false },
  { name: 'Cheddar cheese (1oz)', cal: 113, vegan: false },
  { name: 'Protein shake (whey)', cal: 120, vegan: false },
  { name: 'Beer (12oz)', cal: 153, vegan: false },
  { name: 'Burger (fast food)', cal: 540, vegan: false },
  { name: 'Pizza slice', cal: 285, vegan: false },
  { name: 'French fries (medium)', cal: 365, vegan: false },
];

export const VEGAN_FOODS = FOODS.filter((f) => f.vegan);

const fs = require('fs');

const products = [];

// Helper to generate products
const addProducts = (brand, prefix, suffixes, startNum, endNum, basePrice, priceIncrement, imgUrl) => {
  for (let i = startNum; i <= endNum; i++) {
    suffixes.forEach((suffix, idx) => {
      const name = `${brand} ${prefix}${i}${suffix ? ' ' + suffix : ''}`;
      // Calculate realistic price: newer models are more expensive, 'Pro/Ultra' are more expensive
      let price = basePrice + ((i - startNum) * priceIncrement) + (idx * 200000); 
      
      products.push({
        name,
        brand,
        price,
        stock_quantity: Math.floor(Math.random() * 50) + 5,
        images: `{"${imgUrl}"}`,
        description: `Le magnifique ${name} avec des performances exceptionnelles. Design premium et appareil photo haute résolution.`
      });
    });
  }
};

// SAMSUNG S7 to S26
addProducts('Samsung', 'Galaxy S', ['', 'Plus', 'Ultra'], 7, 26, 150000, 45000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80');

// IPHONE 8 to 17
addProducts('Apple', 'iPhone ', ['', 'Pro', 'Pro Max'], 8, 17, 200000, 60000, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80');

// GOOGLE PIXEL 6 to 11
addProducts('Google', 'Pixel ', ['', 'Pro'], 6, 11, 250000, 50000, 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&w=800&q=80');

// SMARTWATCHES
addProducts('Apple', 'Watch Series ', [''], 6, 10, 150000, 20000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80');
addProducts('Apple', 'Watch Ultra ', [''], 1, 3, 400000, 50000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80');
addProducts('Samsung', 'Galaxy Watch ', ['', 'Classic', 'Ultra'], 4, 7, 130000, 15000, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80');

// Generate SQL
let sql = 'INSERT INTO public.products (name, brand, price, stock_quantity, images, description) VALUES\n';
const values = products.map(p => {
  const name = p.name.replace(/'/g, "''");
  const description = p.description.replace(/'/g, "''");
  return `('${name}', '${p.brand}', ${p.price}, ${p.stock_quantity}, ARRAY['${p.images.replace(/[{}]/g, '')}'], '${description}')`;
});

sql += values.join(',\n') + ';';

fs.writeFileSync('seed.sql', sql);
console.log('Fichier seed.sql généré avec succès !');

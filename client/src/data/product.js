/*  Dynamically build a product list that lines-up with your
    public/images folder tree.

    – Each JPG in a sub-folder becomes one product object.
    – Prices are auto-generated (basePrice + step × index).
    – Sizes per sub-category are configurable.
    – First 3 of every sub-category flagged isTrending = true.
*/

let id = 1;          // running product-id
const products = []; // final export array

// ------------------------------------------------------------------
// 1.  DECLARE WHAT’S INSIDE EACH FOLDER  ✏️  (edit counts / prices)
// ------------------------------------------------------------------
const catalog = {
  boys: {
    kurtas:  { count: 9, basePrice: 999,  step: 50,  sizes: ['M','L','XL'] },
    shoes:   { count: 9, basePrice: 1499, step: 75,  sizes: ['7','8','9','10'] },
    tshirts: { count: 6, basePrice: 699,  step: 25,  sizes: ['S','M','L'] },
  },

  girls: {
    sandals:  { count: 9, basePrice: 899,  step: 40,  sizes: ['5','6','7','8'] },
    earings:  { count: 9, basePrice: 199,  step: 10,  sizes: [] },          // folder name “earings”
    jeans:    { count: 9, basePrice: 1299, step: 60,  sizes: ['S','M','L'] },
    tshirts:  { count: 9, basePrice: 799,  step: 25,  sizes: ['S','M','L'] },
  },

  electronics: {
    headphones: { count: 4, basePrice: 2499, step: 200, sizes: [] },
  },
};

// ------------------------------------------------------------------
// 2.  HELPER TO PUSH ONE PRODUCT INTO THE ARRAY
// ------------------------------------------------------------------
function pushProduct({ category, sub, index, cfg }) {
  products.push({
    id: id++,
    name: `${sub.slice(0,1).toUpperCase() + sub.slice(1)} ${index}`,   // “Shoes 1”
    category,
    subcategory: sub,
    price: cfg.basePrice + cfg.step * (index - 1),
    sizes: cfg.sizes,
    image: `/images/${category}/${sub}/${sub.slice(0, -1)}${index}.jpg`,
    isTrending: index <= 3,
  });
}

// ------------------------------------------------------------------
// 3.  WALK THE catalog OBJECT AND GENERATE THEM ALL
// ------------------------------------------------------------------
Object.entries(catalog).forEach(([category, subs]) => {
  Object.entries(subs).forEach(([sub, cfg]) => {
    for (let i = 1; i <= cfg.count; i++) {
      pushProduct({ category, sub, index: i, cfg });
    }
  });
});

export default products;


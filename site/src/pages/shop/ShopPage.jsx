import { useState, useEffect } from 'react';
import { SlidersHorizontal, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getShopProducts, getShopCategories } from '../../lib/supabase';
import ProductCard from '../../components/shop/ProductCard';
import { useLang } from '../../context/LanguageContext';

function FilterPanel({ search, setSearch, categories, activeCategory, setActiveCategory, brands, activeBrand, setActiveBrand, onClose, ui }) {
  const [brandsOpen, setBrandsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Close button (mobile only) */}
      {onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <p className="text-white font-bold text-sm tracking-widest uppercase">{ui.filters}</p>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder={ui.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input pl-9 text-sm w-full"
        />
      </div>

      {/* Categories */}
      <div>
        <p className="section-subtitle text-xs mb-3">{ui.categories}</p>
        <div className="space-y-1">
          <button
            onClick={() => { setActiveCategory(null); onClose?.() }}
            className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
              !activeCategory ? 'bg-yamato-red text-white' : 'text-white/60 hover:text-white hover:bg-yamato-gray'
            }`}
          >
            {ui.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat.category_slug}
              onClick={() => { setActiveCategory(activeCategory === cat.category_slug ? null : cat.category_slug); onClose?.() }}
              className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
                activeCategory === cat.category_slug ? 'bg-yamato-red text-white' : 'text-white/60 hover:text-white hover:bg-yamato-gray'
              }`}
            >
              {cat.category_name_gr}
            </button>
          ))}
        </div>
      </div>

      {/* Brands — collapsible */}
      {brands.length > 1 && (
        <div>
          <button
            className="flex items-center justify-between w-full section-subtitle text-xs mb-3"
            onClick={() => setBrandsOpen(o => !o)}
          >
            <span>Brand</span>
            {brandsOpen ? <ChevronUp className="w-3 h-3 text-white/30" /> : <ChevronDown className="w-3 h-3 text-white/30" />}
          </button>
          {brandsOpen && (
            <div className="space-y-1">
              <button
                onClick={() => setActiveBrand(null)}
                className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
                  !activeBrand ? 'bg-yamato-red text-white' : 'text-white/60 hover:text-white hover:bg-yamato-gray'
                }`}
              >
                {ui.all}
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
                    activeBrand === brand ? 'bg-yamato-red text-white' : 'text-white/60 hover:text-white hover:bg-yamato-gray'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  const { lang, t } = useLang()
  const ui = t.ui

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeBrand, setActiveBrand]       = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([getShopProducts(), getShopCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeFilterCount = [search, activeCategory, activeBrand].filter(Boolean).length

  const filtered = products.filter(p => {
    const nameForSearch = lang === 'el' ? (p.name_gr || p.name_en) : (p.name_en || p.name_gr)
    const matchSearch   = !search || nameForSearch.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !activeCategory || p.category_slug === activeCategory;
    const matchBrand    = !activeBrand || p.brand === activeBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  return (
    <div className="min-h-screen bg-yamato-black pt-20">

      {/* Hero bar */}
      <div className="border-b border-white/10 bg-yamato-dark">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="section-subtitle">YAMATO STORE</p>
          <h1 className="section-title text-white">SHOP</h1>
          <p className="text-white/50 mt-3 text-sm">Trading cards, collectibles & more</p>
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="lg:hidden sticky top-16 z-20 bg-yamato-dark border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder={ui.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9 text-sm w-full"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(o => !o)}
          className={`relative flex items-center gap-2 px-4 py-2 border text-xs font-bold tracking-wider uppercase transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'border-yamato-red text-yamato-red bg-yamato-red/10'
              : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{ui.filters}</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-yamato-red text-white text-[9px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-yamato-dark border-l border-white/10 overflow-y-auto p-6">
            <FilterPanel
              search={search} setSearch={setSearch}
              categories={categories}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              brands={brands}
              activeBrand={activeBrand} setActiveBrand={setActiveBrand}
              onClose={() => setMobileFiltersOpen(false)}
              ui={ui}
            />
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSearch(''); setActiveCategory(null); setActiveBrand(null); setMobileFiltersOpen(false) }}
                className="mt-6 w-full py-3 border border-white/10 text-white/40 text-xs font-bold tracking-widest uppercase hover:border-yamato-red/40 hover:text-yamato-red transition-all"
              >
                {ui.clearFilters}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
          <FilterPanel
            search={search} setSearch={setSearch}
            categories={categories}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            brands={brands}
            activeBrand={activeBrand} setActiveBrand={setActiveBrand}
            onClose={null}
            ui={ui}
          />
        </aside>

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-sm">
              {loading ? ui.loadingProducts : `${filtered.length} ${ui.products}`}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSearch(''); setActiveCategory(null); setActiveBrand(null) }}
                className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-yamato-red transition-colors"
              >
                <X className="w-3 h-3" />
                {ui.clearFilters}
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="card-dark aspect-[3/4] animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <p className="text-lg">{ui.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

import { CatalogProduct, ProductCategory } from '../types/crm';

export const RAW_CATALOG_NAMES = [
  'Conjunto Grumari – Fibra Sintética Marrom',
  'Kit Grumari – Fibra Sintética Marrom',
  'Espreguiçadeira Flamingo – Corda Náutica Champanhe',
  'Espreguiçadeira Flamingo – Tricô Náutico Laranja',
  'Espreguiçadeira Maragogi – Corda Náutica Verde',
  'Kit Espreguiçadeira Hermosa – Corda Náutica Laranja',
  'Espreguiçadeira Culebra – Corda Náutica Laranja',
  'Espreguiçadeira Culebra – Tricô Náutico Preto',
  'Espreguiçadeira Taboga – Tricô Náutico Cinza',
  'Espreguiçadeira Tortuga – Tricô Náutico Champanhe',
  '2-Espreguiçadeiras Taboga – Tricô Náutico Preto',
  'Espreguiçadeira Taboga – Tricô Náutico Preto',
  'Espreguiçadeira Taboga – Tricô Náutico Preto + colchonete',
  'Kit Espreguiçadeiras Culebra – Fibra Sintética Marrom',
  'Kit Espreguiçadeiras Estrella – Corda Náutica Cinza',
  'Kit Espreguiçadeiras Maragogi + Champanheira – Corda Náutica Champanhe',
  'Balanço Acapulco – Corda Náutica Champanhe',
  'Mesa Central – Tricô Náutico Preto',
  'Balanço Acapulco – Fibra Sintética Argila',
  'Cadeira Bariloche – Corda Náutica Champanhe',
  'Cadeira Bariloche – Corda Náutica Preta',
  'Cadeira Bariloche – Corda Náutica Verde',
  'Chaise Caiobá – Fibra Sintética Marrom',
  'Chaise Cochabamba – Corda Náutica Verde',
  'Chaise Isabela – Tricô Náutico Verde',
  'Champanheira Uvita 70cm – Corda Naútica Champanheira',
  'Champanheira Uvita 50cm – Corda Náutica Preta',
  'Champanheira Uvita 50cm – Corda Náutica Champanhe',
  'Champanheira Uvita 50cm – Corda Náutica Verde',
  'Champanheira Uvita 70cm – Fibra Marrom',
  'Conjunto Bariloche – Corda Náutica Preta',
  'Conjunto Bariloche – Corda Náutica Champanhe',
  'Conjunto Puffs Comfy + Low – Azul Royal',
  'Champanheira – Corda Náutica Preta',
  'Conjunto Bariloche 5L – Corda Náutica Champanhe',
  'Conjunto Bariloche 5L – Corda Náutica Preta',
  'Conjunto Exuma – Corda Náutica Azul',
  'Conjunto Garopaba – Fibra Sintética Marrom',
  'Conjunto Maui – Fibra Sintética Marrom',
  'Banqueta Miramar – Tricô Náutico Verde',
  'Bistrô Torres – Fibra Marrom',
  'Conjunto Vera Cruz – Corda Náutica Champanhe',
  'Conjunto Vera Cruz – Corda Náutica Fuchsia',
  '4 Espreguiçadeiras Estrella – Fibra Marrom',
  'Espreguiçadeira Flamingo – Tricô Náutico Fuschia',
  'Conjunto Cancún – Corda Náutica bege',
  'Conjunto Capri – Corda Náutica Verde',
  'Conjunto Mizata – Corda Náutica Verde',
  'Conjunto Cancún – Corda Náutica Champanhe',
  'Conjunto Cancún – Corda Náutica Preta',
  'Mesa Central Uvita – Corda Náutica Champanhe',
  'Kit Camboriú – Fibra Marrom',
  'Kit Camboriú – Horizontal Argila',
  'Kit Macaé – Fibra Palha',
  'Kit Gramado – Fibra Champanhe',
  'Kit Laguna – Fibra Sintética Marrom',
  'Kit Medellín – Corda Náutica Preta',
  'Kit Medellín – Corda Náutica Verde',
  'Kit Medellín – Tricô Náutico Champanhe',
  'Kit Medellín – Tricô Náutico Verde',
  'Kit Paraty – Fibra Marrom',
  'Mesa Carmelo 6 lugares – Fibra Marrom',
  'Mesa Monterrey 4 Lugares – Corda náutica Preta',
  'Espreguiçadeira Maragogi – Corda Náutica Preta',
  'Espreguiçadeiras Maragogi – Fibra Champanhe',
  'Espreguiçadeiras Maragogi – Fibra Marrom',
  'Puff Comfy Turquesa – 9039',
  'Puff Comfy – Laranja 6280',
  'Puff Comfy – Ocre 2800',
  'Puff Comfy – Roxo 3961',
  'Puff Comfy – Vermelho 6352',
  'Puff Comfy Verde – 3170',
  'Puff SurgiLar (unidade)'
];

// Helper to determine category from product name
export const getCategoryFromName = (name: string): ProductCategory => {
  const lower = name.toLowerCase();
  if (lower.startsWith('conjunto')) return 'Conjuntos';
  if (lower.startsWith('kit')) return 'Kits';
  if (lower.includes('espreguiçadeira')) return 'Espreguiçadeiras';
  if (lower.startsWith('cadeira')) return 'Cadeiras';
  if (lower.startsWith('chaise')) return 'Chaises';
  if (lower.startsWith('balanço') || lower.startsWith('balanco')) return 'Balanços';
  if (lower.startsWith('mesa')) return 'Mesas';
  if (lower.startsWith('banqueta') || lower.startsWith('bistrô') || lower.startsWith('bistro')) return 'Banquetas';
  if (lower.startsWith('champanheira')) return 'Champanheiras';
  if (lower.startsWith('puff')) return 'Puffs';
  return 'Outros';
};

// Helper to extract material / finish from product name after dash
export const getMaterialFromName = (name: string): string => {
  if (name.includes('–')) {
    const parts = name.split('–');
    return parts.slice(1).join('–').trim();
  }
  if (name.includes('-')) {
    const parts = name.split('-');
    if (parts.length > 1) {
      return parts.slice(1).join('-').trim();
    }
  }
  if (name.toLowerCase().includes('puff surgilar')) {
    return 'Tecido Náutico / Espuma D33';
  }
  return 'Acabamento Artesanal SurgiLar';
};

// Helper to get suggested price for a product
export const getSuggestedPriceForProduct = (name: string): number => {
  const lower = name.toLowerCase();

  // Specific Sets
  if (lower.includes('bariloche 5l')) return 7900;
  if (lower.includes('conjunto bariloche')) return 6200;
  if (lower.includes('conjunto cancún') || lower.includes('conjunto cancun')) return 6800;
  if (lower.includes('conjunto capri')) return 7200;
  if (lower.includes('conjunto vera cruz')) return 7400;
  if (lower.includes('conjunto exuma')) return 6900;
  if (lower.includes('conjunto garopaba')) return 6400;
  if (lower.includes('conjunto maui')) return 6100;
  if (lower.includes('conjunto mizata')) return 6600;
  if (lower.includes('conjunto cataratas')) return 12900;
  if (lower.includes('conjunto grumari')) return 6500;
  if (lower.includes('conjunto puffs comfy + low')) return 1650;
  if (lower.includes('sofá modular') || lower.includes('sofa modular')) return 18500;

  // Specific Kits
  if (lower.includes('4 espreguiçadeiras') || lower.includes('4 espreguicadeiras')) return 9200;
  if (lower.includes('kit espreguiçadeiras maragogi + champanheira') || lower.includes('kit espreguicadeiras maragogi + champanheira')) return 6800;
  if (lower.includes('kit espreguiçadeiras estrella') || lower.includes('kit espreguicadeiras estrella')) return 5800;
  if (lower.includes('kit espreguiçadeira hermosa') || lower.includes('kit espreguicadeira hermosa')) return 4800;
  if (lower.includes('kit espreguiçadeiras culebra') || lower.includes('kit espreguicadeiras culebra')) return 5200;
  if (lower.includes('kit medellín') || lower.includes('kit medellin')) return 4900;
  if (lower.includes('kit camboriú') || lower.includes('kit camboriu')) return 5400;
  if (lower.includes('kit paraty')) return 4950;
  if (lower.includes('kit laguna')) return 4800;
  if (lower.includes('kit gramado')) return 4600;
  if (lower.includes('kit macaé') || lower.includes('kit macae')) return 4500;
  if (lower.includes('kit grumari')) return 5400;

  // Espreguiçadeiras
  if (lower.includes('2-espreguiçadeiras taboga') || lower.includes('2-espreguicadeiras taboga')) return 4800;
  if (lower.includes('espreguiçadeira taboga + colchonete') || lower.includes('espreguicadeira taboga + colchonete')) return 2850;
  if (lower.includes('espreguiçadeira flamingo') || lower.includes('espreguicadeira flamingo')) return 2450;
  if (lower.includes('espreguiçadeira maragogi') || lower.includes('espreguicadeira maragogi')) return 2600;
  if (lower.includes('espreguiçadeiras maragogi') || lower.includes('espreguicadeiras maragogi')) return 4900;
  if (lower.includes('espreguiçadeira culebra') || lower.includes('espreguicadeira culebra')) return 2300;
  if (lower.includes('espreguiçadeira taboga') || lower.includes('espreguicadeira taboga')) return 2500;
  if (lower.includes('espreguiçadeira tortuga') || lower.includes('espreguicadeira tortuga')) return 2700;

  // Balanços & Chaises
  if (lower.includes('balanço acapulco') || lower.includes('balanco acapulco')) return 4400;
  if (lower.includes('balanço rincón') || lower.includes('balanco rincon')) return 4600;
  if (lower.includes('chaise caiobá') || lower.includes('chaise caioba')) return 4200;
  if (lower.includes('chaise cochabamba')) return 4800;
  if (lower.includes('chaise isabela')) return 4600;
  if (lower.includes('chaise saint-tropez')) return 5200;

  // Mesas & Cadeiras
  if (lower.includes('mesa carmelo 6 lugares')) return 5400;
  if (lower.includes('mesa monterrey 4 lugares')) return 4100;
  if (lower.includes('mesa central uvita')) return 1950;
  if (lower.includes('mesa central')) return 1850;
  if (lower.includes('mesa riviera')) return 7800;
  if (lower.includes('cadeira bariloche')) return 1250;

  // Banquetas & Champanheiras
  if (lower.includes('bistrô torres') || lower.includes('bistro torres')) return 2100;
  if (lower.includes('bistrô ibiza') || lower.includes('bistro ibiza')) return 3900;
  if (lower.includes('banqueta miramar')) return 1350;
  if (lower.includes('champanheira uvita 70cm')) return 1450;
  if (lower.includes('champanheira uvita 50cm')) return 1150;
  if (lower.includes('champanheira')) return 1200;

  // Puffs
  if (lower.includes('puff comfy')) return 850;
  if (lower.includes('puff surgilar')) return 750;
  if (lower.includes('puff')) return 800;

  // Generic fallback by Category
  if (lower.startsWith('conjunto')) return 6500;
  if (lower.startsWith('kit')) return 4900;
  if (lower.includes('espreguiçadeira') || lower.includes('espreguicadeira')) return 2500;
  if (lower.startsWith('chaise')) return 4500;
  if (lower.startsWith('balanço') || lower.startsWith('balanco')) return 4400;
  if (lower.startsWith('mesa')) return 3800;
  if (lower.startsWith('cadeira')) return 1200;
  if (lower.startsWith('banqueta')) return 1300;
  if (lower.startsWith('champanheira')) return 1250;

  return 3500;
};

export const SURGILAR_CATALOG_PRODUCTS: CatalogProduct[] = RAW_CATALOG_NAMES.map((name, index) => {
  const category = getCategoryFromName(name);
  const material = getMaterialFromName(name);
  const suggestedPrice = getSuggestedPriceForProduct(name);

  return {
    id: `prod-surgilar-${index + 1}`,
    name,
    category,
    material,
    suggestedPrice,
    description: `Mobiliário de alto padrão da Linha SurgiLar. Estrutura em alumínio naval com pintura eletrostática e acabamento em ${material}. Resistente a intempéries, raios UV e umidade.`,
    featured: index < 6
  };
});

export type ProductFeature = {
  feature: string;
  value: string;
};

export type Review = {
  user_id: string;
  user_name: string;
  user_image: string;
  stars: number;
  description: string;
  time: string;
};

export type GeneralSpecs = {
  model: string;
  layout: string;
  color: string;
  keyboard_shell: string;
  surface_finish: string;
  weight: string;
};

export type SwitchTypingExperience = {
  switch_type: string;
  mounting_structure: string;
  hot_swappable: string;
  n_key_rollover: string;
};

export type PlatePCB = {
  plate_material: string;
  pcb: string;
  quick_disassemble: string;
};

export type Keycaps = {
  profile: string;
  material: string;
};

export type ConnectivityCompatibility = {
  modes: string;
  polling_rate: string;
  battery_capacity: string;
  compatible_systems: string;
};

export type InternalSoundDampening = {
  foam_layers: string;
};

export type RGBCustomization = {
  backlight: string;
  software_support: string;
};

export type Specifications = {
  general: GeneralSpecs;
  switch_typing_experience: SwitchTypingExperience;
  plate_pcb: PlatePCB;
  keycaps: Keycaps;
  connectivity_compatibility: ConnectivityCompatibility;
  internal_sound_dampening: InternalSoundDampening;
  rgb_customization: RGBCustomization;
  additional_features: string[];
};

export type Products = {
  id: string;
  title: string;
  image: string;
  information: ProductFeature[];
  images: string[];
  price: number;
  availability: string;
  quantity: number;
  brand: string;
  reviews: Review[];
  description: string;
  specifications: Specifications;
  warranty: string;
  weight: string;
  category: string;
};

export interface SearchParams {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  categories?: string;
  brands?: string;
  inStock?: string;
}

-- PLACEHOLDER content. Replace with real, community-checked content.
-- Afaan Oromoo names below are common words but must be reviewed by a native speaker.
insert into public.categories (section, name, name_om, slug, sort_order) values
  ('clothes', 'Clothes',               'Uffata',   'clothes',     1),
  ('clothes', 'Accessories & jewelry', null,       'accessories', 2),
  ('food',    'Foods',                 'Nyaata',   'foods',       3),
  ('food',    'Coffee',                'Buna',     'coffee',      4),
  ('games',   'Traditional games',     'Taphoota', 'games',       5);

insert into public.products (category_id, name, slug, description, cultural_note, price_cents, stock, is_featured)
select c.id, v.name, v.slug, v.description, v.cultural_note, v.price_cents, v.stock, v.is_featured
from (values
  ('Handwoven cotton dress (sample)', 'sample-cotton-dress', 'Replace with a real product.', 'Describe when and why this is worn.', 350000, 10, true,  'clothes'),
  ('Traditional shawl (sample)',      'sample-shawl',        'Replace with a real product.', null,                               120000, 15, false, 'clothes'),
  ('Beaded necklace (sample)',        'sample-necklace',     'Replace with a real product.', null,                                80000, 20, false, 'accessories'),
  ('Ground coffee 500g (sample)',     'sample-coffee',       'Replace with a real product.', 'Describe how it is prepared and shared.', 45000, 40, true, 'coffee'),
  ('Spice mix 250g (sample)',         'sample-spice-mix',    'Replace with a real product.', null,                                30000, 30, false, 'foods'),
  ('Game board set (sample)',         'sample-game-set',     'Replace with a real product.', null,                               150000, 12, false, 'games')
) as v(name, slug, description, cultural_note, price_cents, stock, is_featured, cat_slug)
join public.categories c on c.slug = v.cat_slug;

insert into public.events (title, slug, description, starts_at, location, city, is_published) values
  ('Sample community cultural day', 'sample-cultural-day', 'Replace with a real event.',
   now() + interval '30 days', 'Community hall', 'Addis Ababa', true),
  ('Sample cultural market', 'sample-cultural-market', 'Replace with a real event.',
   now() + interval '60 days', 'Town square', 'Adama', true);

insert into public.game_guides (name, slug, summary, how_to_play, history, is_published) values
  ('Sample traditional game', 'sample-game',
   'Replace with a real game from your community.',
   'Describe the rules step by step.',
   'Describe where the game comes from.', true);

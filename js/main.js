import { get_translation } from './i18n.js';
import { projects } from './projects.js';

const language_storage_key = 'portfolio_language';
const theme_storage_key = 'portfolio_theme';
const preferred_language = read_storage(language_storage_key);
let current_language = preferred_language === 'de' ? 'de' : 'en';
let current_theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

function read_storage(storage_key) {
  try {
    return localStorage.getItem(storage_key);
  } catch {
    return null;
  }
}

function save_storage(storage_key, value) {
  try {
    localStorage.setItem(storage_key, value);
  } catch {
    // The page remains fully usable if browser storage is unavailable.
  }
}

function translate_static_content() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const translation_key = element.getAttribute('data-i18n');
    element.textContent = get_translation(current_language, translation_key);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const translation_key = element.getAttribute('data-i18n-aria-label');
    element.setAttribute('aria-label', get_translation(current_language, translation_key));
  });

  document.documentElement.lang = current_language;
  document.querySelector('.language_switcher')?.setAttribute('aria-label', get_translation(current_language, 'a11y.choose_language'));
  document.querySelector('.desktop_nav')?.setAttribute('aria-label', get_translation(current_language, 'a11y.main_nav'));
  document.querySelector('.mobile_nav')?.setAttribute('aria-label', get_translation(current_language, 'a11y.mobile_nav'));
  const menu_toggle = document.querySelector('#menu_toggle');
  if (menu_toggle) set_menu_open(menu_toggle.getAttribute('aria-expanded') === 'true');

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === current_language));
  });

  const page_title = document.querySelector('meta[property="og:title"]');
  const page_description = document.querySelector('meta[name="description"]');
  const social_description = document.querySelector('meta[property="og:description"]');
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', current_language === 'de' ? 'de_DE' : 'en_US');
  if (document.querySelector('#projects_grid')) {
    document.title = get_translation(current_language, 'metadata.home_title');
    page_description?.setAttribute('content', get_translation(current_language, 'metadata.home_description'));
    page_title?.setAttribute('content', get_translation(current_language, 'metadata.home_title'));
    social_description?.setAttribute('content', get_translation(current_language, 'metadata.social_description'));
  }

  update_theme_control();
  window.dispatchEvent(new CustomEvent('portfolio_language_change', { detail: { language: current_language } }));
}

function apply_language(language, persist = true) {
  current_language = language === 'de' ? 'de' : 'en';
  if (persist) save_storage(language_storage_key, current_language);
  translate_static_content();
}

function update_theme_control() {
  const theme_toggle = document.querySelector('#theme_toggle');
  if (!theme_toggle) return;

  const sun_icon = theme_toggle.querySelector('.theme_icon_sun');
  const moon_icon = theme_toggle.querySelector('.theme_icon_moon');
  if (sun_icon) sun_icon.hidden = current_theme === 'light';
  if (moon_icon) moon_icon.hidden = current_theme === 'dark';
  theme_toggle.setAttribute('aria-label', get_translation(current_language, current_theme === 'light' ? 'a11y.theme_to_dark' : 'a11y.theme_to_light'));
}

function apply_theme(theme, persist = false) {
  current_theme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = current_theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', current_theme === 'dark' ? '#171b22' : '#f6f5f1');
  if (persist) save_storage(theme_storage_key, current_theme);
  update_theme_control();
}

function set_menu_open(is_open, return_focus = false) {
  const menu_toggle = document.querySelector('#menu_toggle');
  const mobile_nav = document.querySelector('#mobile_nav');
  if (!menu_toggle || !mobile_nav) return;

  menu_toggle.setAttribute('aria-expanded', String(is_open));
  menu_toggle.setAttribute('aria-label', get_translation(current_language, is_open ? 'a11y.menu_close' : 'a11y.menu_open'));
  mobile_nav.hidden = !is_open;
  const open_icon = menu_toggle.querySelector('.menu_icon_open');
  const close_icon = menu_toggle.querySelector('.menu_icon_close');
  if (open_icon) open_icon.hidden = is_open;
  if (close_icon) close_icon.hidden = !is_open;
  if (!is_open && return_focus) menu_toggle.focus();
}

function create_element(tag_name, class_name, text_value) {
  const element = document.createElement(tag_name);
  if (class_name) element.className = class_name;
  if (text_value !== undefined) element.textContent = text_value;
  return element;
}

function get_project_text(project, field_name, language) {
  const field_value = project[field_name];
  if (typeof field_value === 'string') return field_value;
  if (field_value && typeof field_value === 'object') return field_value[language] || field_value.en || '';
  return '';
}

function create_project_visual(project, project_index) {
  const visual = create_element('div', `project_visual project_visual_${(project_index % 3) + 1}`);

  if (project.preview_image) {
    const image = create_element('img', 'project_preview_image');
    image.src = project.preview_image;
    image.alt = get_project_text(project, 'preview_alt', current_language) || get_project_text(project, 'name', current_language);
    image.width = 1200;
    image.height = 750;
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove());
    visual.append(image);
  } else {
    visual.setAttribute('aria-hidden', 'true');
    const visual_frame = create_element('div', 'visual_frame');
    const visual_header = create_element('div', 'visual_header');
    visual_header.append(create_element('span', 'visual_header_mark'), create_element('span', 'visual_header_line'));
    const visual_content = create_element('div', 'visual_content');
    visual_content.append(create_element('span', 'visual_placeholder_label', get_translation(current_language, 'projects.placeholder_preview')));
    const visual_shapes = create_element('div', 'visual_shapes');
    visual_shapes.append(create_element('span', 'visual_shape visual_shape_one'), create_element('span', 'visual_shape visual_shape_two'), create_element('span', 'visual_shape visual_shape_three'));
    visual_content.append(visual_shapes);
    visual_frame.append(visual_header, visual_content);
    visual.append(visual_frame);
  }

  return visual;
}

function create_project_card(project, project_index) {
  const card = create_element('a', 'project_card');
  const card_id = `project_card_${project.id}`;
  card.href = `project.html?project=${encodeURIComponent(project.id)}`;
  card.append(create_project_visual(project, project_index));

  const content = create_element('div', 'project_card_content');
  const meta_row = create_element('div', 'project_meta_row');
  meta_row.append(create_element('span', 'project_number', String(project_index + 1).padStart(2, '0')));
  const status = create_element('span', 'project_status', get_translation(current_language, `project_status.${project.status || 'placeholder'}`));
  status.id = `${card_id}_status`;
  meta_row.append(status);
  const title = create_element('h3', 'project_card_title', get_project_text(project, 'name', current_language));
  title.id = `${card_id}_title`;
  const description = create_element('p', 'project_card_description', get_project_text(project, 'description', current_language));
  description.id = `${card_id}_description`;
  const footer = create_element('span', 'project_card_action');
  const action_label = create_element('span', '', get_translation(current_language, 'projects.card_action'));
  action_label.id = `${card_id}_action`;
  const action_arrow = create_element('span', 'action_arrow', '↗');
  action_arrow.setAttribute('aria-hidden', 'true');
  footer.append(action_label, action_arrow);
  card.setAttribute('aria-labelledby', `${title.id} ${status.id} ${action_label.id}`);
  const description_ids = description.textContent.trim() ? [description.id] : [];

  content.append(meta_row, title, description);
  if (Array.isArray(project.technologies) && project.technologies.length > 0) {
    const technology_list = create_element('ul', 'project_technology_list');
    technology_list.id = `${card_id}_technologies`;
    project.technologies.forEach((technology) => technology_list.append(create_element('li', '', technology)));
    content.append(technology_list);
    description_ids.push(technology_list.id);
  }
  if (description_ids.length) card.setAttribute('aria-describedby', description_ids.join(' '));
  content.append(footer);
  card.append(content);
  return card;
}

function render_projects() {
  const projects_grid = document.querySelector('#projects_grid');
  if (!projects_grid) return;
  const project_cards = projects.map((project, project_index) => create_project_card(project, project_index));
  projects_grid.replaceChildren(...project_cards);
}

function init_language_controls() {
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => apply_language(button.dataset.language));
  });
}

function init_theme_control() {
  const theme_toggle = document.querySelector('#theme_toggle');
  theme_toggle?.addEventListener('click', () => apply_theme(current_theme === 'light' ? 'dark' : 'light', true));

  const saved_theme = read_storage(theme_storage_key);
  const system_theme_query = window.matchMedia('(prefers-color-scheme: dark)');
  apply_theme(saved_theme === 'dark' || saved_theme === 'light' ? saved_theme : (system_theme_query.matches ? 'dark' : 'light'));
  system_theme_query.addEventListener?.('change', (event) => {
    if (!read_storage(theme_storage_key)) apply_theme(event.matches ? 'dark' : 'light');
  });
}

function init_mobile_navigation() {
  const menu_toggle = document.querySelector('#menu_toggle');
  const mobile_nav = document.querySelector('#mobile_nav');
  if (!menu_toggle || !mobile_nav) return;

  menu_toggle.addEventListener('click', () => set_menu_open(menu_toggle.getAttribute('aria-expanded') !== 'true'));
  mobile_nav.querySelectorAll('a').forEach((nav_link) => nav_link.addEventListener('click', () => {
    const target_id = nav_link.hash.slice(1);
    const target = document.getElementById(target_id);
    target?.focus({ preventScroll: true });
    set_menu_open(false);
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu_toggle.getAttribute('aria-expanded') === 'true') set_menu_open(false, true);
  });
  document.addEventListener('click', (event) => {
    if (menu_toggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site_header')) set_menu_open(false);
  });
  window.matchMedia('(min-width: 801px)').addEventListener?.('change', (event) => {
    if (!event.matches) return;
    const mobile_nav_had_focus = mobile_nav.contains(document.activeElement);
    set_menu_open(false);
    if (mobile_nav_had_focus) document.querySelector('.desktop_nav a')?.focus();
  });
}

function init_footer_year() {
  const footer_year = document.querySelector('#footer_year');
  if (footer_year) footer_year.textContent = String(new Date().getFullYear());
}

window.addEventListener('portfolio_language_change', render_projects);
init_language_controls();
init_theme_control();
init_mobile_navigation();
init_footer_year();
render_projects();
apply_language(current_language, false);

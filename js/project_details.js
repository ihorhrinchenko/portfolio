import './main.js';
import { get_translation } from './i18n.js';
import { get_project, projects } from './projects.js';

const project_id = new URLSearchParams(window.location.search).get('project');
const project = get_project(project_id);

function create_element(tag_name, class_name, text_value) {
  const element = document.createElement(tag_name);
  if (class_name) element.className = class_name;
  if (text_value !== undefined) element.textContent = text_value;
  return element;
}

function get_localized_value(value, language) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return value[language] || value.en || '';
  return '';
}

function get_project_number() {
  const project_index = projects.indexOf(project);
  return String(project_index + 1).padStart(2, '0');
}

function get_external_url(url_value) {
  if (typeof url_value !== 'string' || !url_value.trim()) return '';
  try {
    const parsed_url = new URL(url_value);
    return parsed_url.protocol === 'https:' ? parsed_url.href : '';
  } catch {
    return '';
  }
}

function append_project_preview(container, language) {
  if (project.preview_image) {
    const image = create_element('img', 'detail_preview_image');
    image.src = project.preview_image;
    image.alt = get_localized_value(project.preview_alt, language) || get_localized_value(project.name, language);
    image.width = 1440;
    image.height = 900;
    image.addEventListener('error', () => image.remove());
    container.append(image);
    return;
  }

  const placeholder = create_element('div', 'detail_preview_placeholder');
  placeholder.setAttribute('aria-hidden', 'true');
  const placeholder_mark = create_element('span', 'detail_preview_mark', 'IH.');
  const placeholder_label = create_element('span', 'detail_preview_label', get_translation(language, 'projects.preview_unavailable'));
  const placeholder_number = create_element('span', 'detail_preview_number', get_project_number());
  placeholder.append(placeholder_mark, placeholder_label, placeholder_number);
  container.append(placeholder);
}

function append_content_section(parent, title_key, content, language, list_mode = false) {
  if (!content || (Array.isArray(content) && content.length === 0)) return;
  const section = create_element('section', 'detail_content_section');
  section.append(create_element('h2', '', get_translation(language, title_key)));

  if (Array.isArray(content)) {
    const list = create_element(list_mode ? 'ol' : 'ul', 'detail_list');
    content.forEach((item) => {
      const item_text = get_localized_value(item, language);
      if (item_text) list.append(create_element('li', '', item_text));
    });
    if (list.children.length === 0) return;
    section.append(list);
  } else {
    const section_text = get_localized_value(content, language);
    if (!section_text.trim()) return;
    section.append(create_element('p', '', section_text));
  }
  parent.append(section);
}

function append_link(parent, url_value, translation_key, language) {
  const safe_url = get_external_url(url_value);
  if (!safe_url) return;
  const link = create_element('a', 'button button_secondary', get_translation(language, translation_key));
  link.href = safe_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.append(create_element('span', 'sr_only', get_translation(language, 'a11y.opens_new_tab')));
  const link_arrow = create_element('span', 'link_arrow', '↗');
  link_arrow.setAttribute('aria-hidden', 'true');
  link.append(link_arrow);
  parent.append(link);
}

function update_detail_metadata(language) {
  const page_title = project
    ? `${get_localized_value(project.name, language)} — ${get_translation(language, 'project_detail.page_title_suffix')}`
    : get_translation(language, 'project_detail.not_found_title');
  const page_description = project && project.is_placeholder
    ? get_translation(language, 'project_detail.metadata_placeholder')
    : get_localized_value(project?.description, language) || get_translation(language, 'project_detail.metadata_placeholder');
  document.title = page_title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', page_description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', page_title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', page_description);
}

function render_not_found(root, language) {
  const error_state = create_element('section', 'project_error_state');
  error_state.append(create_element('p', 'section_index', get_translation(language, 'project_detail.not_found_index')));
  error_state.append(create_element('h1', '', get_translation(language, 'project_detail.not_found_title')));
  error_state.append(create_element('p', 'project_error_message', get_translation(language, 'project_detail.not_found_message')));
  const back_link = create_element('a', 'button button_primary', get_translation(language, 'project_detail.back'));
  back_link.href = '/#projects_section';
  error_state.append(back_link);
  root.replaceChildren(error_state);
}

function render_project_detail(language) {
  const root = document.querySelector('#project_detail_root');
  if (!root) return;
  update_detail_metadata(language);

  if (!project) {
    render_not_found(root, language);
    return;
  }

  const detail_layout = create_element('article', 'project_detail');
  const detail_header = create_element('header', 'project_detail_header');
  const detail_meta = create_element('div', 'project_detail_meta');
  detail_meta.append(create_element('span', 'project_type', get_translation(language, `project_type.${project.type}`)));
  detail_meta.append(create_element('span', 'project_number', get_project_number()));
  detail_header.append(detail_meta);
  detail_header.append(create_element('h1', '', get_localized_value(project.name, language)));
  detail_header.append(create_element('p', 'project_detail_summary', get_localized_value(project.description, language)));
  detail_layout.append(detail_header);

  const preview = create_element('div', 'project_detail_preview');
  append_project_preview(preview, language);
  detail_layout.append(preview);

  if (project.is_placeholder) {
    const placeholder_note = create_element('aside', 'project_placeholder_note');
    const placeholder_mark = create_element('span', 'placeholder_note_mark', '↳');
    placeholder_mark.setAttribute('aria-hidden', 'true');
    placeholder_note.append(placeholder_mark);
    const placeholder_copy = create_element('div', '');
    placeholder_copy.append(create_element('h2', '', get_translation(language, 'project_detail.placeholder_title')));
    placeholder_copy.append(create_element('p', '', get_translation(language, 'project_detail.placeholder_message')));
    placeholder_note.append(placeholder_copy);
    detail_layout.append(placeholder_note);
  } else {
    const detail_body = create_element('div', 'project_detail_body');
    append_content_section(detail_body, 'project_detail.features', get_localized_value(project.features, language), language, true);
    append_content_section(detail_body, 'project_detail.implementation', project.implementation_details, language);
    append_content_section(detail_body, 'project_detail.challenges', project.challenges, language);
    append_content_section(detail_body, 'project_detail.lessons', project.lessons_learned, language);

    if (Array.isArray(project.technologies) && project.technologies.length) {
      const technologies_section = create_element('section', 'detail_content_section');
      technologies_section.append(create_element('h2', '', get_translation(language, 'project_detail.technologies')));
      const technology_list = create_element('ul', 'skill_tags detail_technology_list');
      project.technologies.forEach((technology) => technology_list.append(create_element('li', '', technology)));
      technologies_section.append(technology_list);
      detail_body.append(technologies_section);
    }

    const project_links = create_element('div', 'project_detail_links');
    append_link(project_links, project.live_demo_url, 'project_detail.live_demo', language);
    append_link(project_links, project.github_url, 'project_detail.repository', language);
    if (project_links.children.length) detail_body.append(project_links);
    detail_layout.append(detail_body);
  }

  root.replaceChildren(detail_layout);
}

window.addEventListener('portfolio_language_change', (event) => render_project_detail(event.detail.language));
render_project_detail(document.documentElement.lang === 'de' ? 'de' : 'en');

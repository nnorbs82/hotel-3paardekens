# Pages CMS accepts an empty input in its schema but cannot open that media picker.
require 'yaml'
require 'json'
require 'pathname'

root = Pathname.new(__dir__).parent
config = YAML.load_file(root.join('.pages.yml'))
media = config.fetch('media').to_h { |source| [source.fetch('name'), source] }
image_fields = 0

check_image = lambda do |field, value|
  source = media.fetch(field.fetch('options').fetch('media'))
  input = source.fetch('input')
  output = source.fetch('output')
  raise "Media picker needs a real directory: #{source['name']}" if input.empty? || input == '.'
  raise "Missing media directory: #{input}" unless root.join(input).directory?
  raise "Default is outside media directory: #{value}" unless value.start_with?(output + '/')
  file = root.join(input, value.delete_prefix(output + '/'))
  raise "Missing default image: #{file}" unless file.file?
  raise "Unsupported default extension: #{file}" unless field['options']['extensions'].include?(file.extname.delete_prefix('.'))
  raise "Upload path is outside media: #{field['name']}" unless field['options']['path'].start_with?(input)
  image_fields += 1
end

visit = nil
visit = lambda do |fields, data|
  fields.each do |field|
    value = data[field.fetch('name')]
    if field['type'] == 'object'
      values = field['list'] ? value : [value]
      values.each { |item| visit.call(field.fetch('fields'), item) }
    elsif field['type'] == 'image'
      check_image.call(field, value)
    end
  end
end

config.fetch('content').find { |item| item['name'] == 'website_images' }.fetch('items').each do |entry|
  visit.call(entry.fetch('fields'), JSON.parse(root.join(entry.fetch('path')).read))
end
raise 'Favicon appearance changed' unless root.join('favicon.ico').binread == root.join('assets/favicon.ico').binread
raise "Expected 14 image defaults, got #{image_fields}" unless image_fields == 14
puts "PASS: #{image_fields} CMS image defaults, supported media directories, upload paths and identical favicon bytes"

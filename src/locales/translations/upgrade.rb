require 'yaml'
require 'json'

def flatten(hash, prefix = '')
  hash.each_with_object({}) do |(key, value), out|
    if value.is_a?(Hash)
      out.merge!(flatten(value, "#{prefix}#{key}."))
    else
      out["#{prefix}#{key}"] = value
    end
  end
end

Dir['*.yaml'].each do |file|
  data = YAML.load_file(file)
  out_file = file.sub('.yaml', '.json')
  result = flatten(data).map do |key, value|
    [key, {
      message: value,
      description: key.gsub('.', ' -> ')
    }]
  end

  File.open(out_file, 'w') do |f|
    f.write(JSON.pretty_generate(result.to_h))
  end
end

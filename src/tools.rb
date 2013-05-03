class Tools

  # Load config from config/app.yml
  def self.load_config config_name
    config = YAML.load_file("config/app.yml")
    if config[config_name]
      return config[config_name]
    else
      raise "Error config '#{config_name}' not found in app.yml"
    end
  end

end

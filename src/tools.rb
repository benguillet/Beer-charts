class Tools

  @config = nil

  # Load config from config/app.yml
  def self.load_config config_name
    
    # If already loaded then return it
    if !@config.nil? && !@config[config_name].nil?
      return @config[config_name]
    end

    # If not load then read the yaml file 
    config = YAML.load_file("config/app.yml")
    if !config[config_name].nil?
      @config = config
      return @config[config_name]
    else
      raise "Error config '#{config_name}' not found in app.yml"
    end
  end

end

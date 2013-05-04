require 'net/http'

class User

  @headers = nil

  def initialize(login, password)
    @login = login
    @password = password
    connection!
  end

  def connection!

    # Load config
    urls = Tools::load_config('url')
    form = Tools::load_config('form')
    
    # Connection Request
    http = Net::HTTP.new(urls['base'], 80)
    data = Tools::parameterize({ 
      'username'   => @login,
      'password'   => @password,
      'domain'     => form['domain'], 
      'connectbtn' => form['btn']
    })
    res  = http.post(urls['connect'], data)
    
    # Save the cookies
    @headers = {
      'Cookie' => res.to_hash['set-cookie'].collect{
        |ea| ea[/^.*?;/]
      }.join
    }

  end

  def connected?
    return true
    config_cookie = Tools::load_config('cookies');
    @cookies.include? config_cookie['auth_cookie']
  end

  def getData criteria
    return getMonthlyBalance
  end

  def getMonthlyBalance
    #urls = Tools::load_config('url')
    #http = Net::HTTP.new(urls['base'], 80)
    #res  = http.get(urls['compte'], @headers) 
  end
  
end

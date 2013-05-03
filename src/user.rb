require 'net/http'

class User

  @cookies = nil

  def initialize(login, password)
    @login = login
    @password = password
    connection!
  end

  def connection!
    urls = Tools::load_config('url')
    form = Tools::load_config('form')
    # Request
    res = Net::HTTP.post_form(URI(urls['connect']), 'domain' => form['domain'], 
                                                    'username' => @login,
                                                    'password' => @password,
                                                    'connectbtn' => form['btn'])
    # Save the cookies
    cookies_array = Array.new
    all_cookies = res.get_fields('set-cookie')
    all_cookies.each { | cookie | cookies_array.push(cookie.split('; ')[0]) }
    @cookies = cookies_array.join('; ') 
  end

  def connected?
    config_cookie = Tools::load_config('cookies');
    @cookies.include? config_cookie['auth_cookie']
  end

  def getData criteria
    #TODO retreive data from website
  end
  
end

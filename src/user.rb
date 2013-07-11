require 'net/http'
require 'nokogiri'
require 'active_support/core_ext'

class User

  def initialize(login, password)
    @login = login
    @password = password
    connection!
  end

  def self.initByCookie(cookie)
    user = User.new(nil, nil)
    user.setCookie(cookie)
    return user
  end

  def setCookie(cookie)
    @headers = { 'Cookie' => cookie }
  end

  def connection!

    # Load config
    urls = Tools::load_config('url')
    form = Tools::load_config('form')

    # Connection Request
    http = Net::HTTP.new(urls['base'], 80)
    data = {
      'username'   => @login,
      'password'   => @password,
      'domain'     => form['domain'],
      'connectbtn' => form['btn']
    }.to_query
    res  = http.post(urls['connect'], data)

    # Save the cookies
    @headers = {
      'Cookie' => res.to_hash['set-cookie'].collect{
        |ea| ea[/^.*?;/]
      }.join
    }

  end

  def connected?
    config_cookie = Tools::load_config('cookies');
    @headers['Cookie'].include? config_cookie['auth_cookie']
  end

  def cookie
    @headers['Cookie']
  end

  def getAllData data
    months = Array.new
    data.each_value { |month| months.push month["date"] }

    urls  = Tools::load_config('url')
    http = Net::HTTP.new(urls['base'], 80)

    data = Array.new
    months.each do |month|
      url  = urls['month'] + month.split("/").reverse().join("")
      res  = http.get(url, @headers)
      doc  = Nokogiri::HTML(res.body)
      doc.xpath('//table[1]/tr[position()>1]').each do |node|
        if node.children[10].content.include? 'BDF'
          data << { "month"   => month,
                    "time"    => node.children[2].content,
                    "name"    => node.children[4].content,
                    "lieu"    => node.children[6].content,
                    "vendeur" => node.children[8].content,
                    "qte"     => node.children[12].content,
                    "prix"    => node.children[14].content }
        end
      end
    end
    return data
  end

  def getMonthlyBalance
    urls  = Tools::load_config('url')
    http = Net::HTTP.new(urls['base'], 80)
    res  = http.get(urls['compte'], @headers)
    data = Array.new
    doc  = Nokogiri::HTML(res.body)

    doc.xpath('//table[1]/tr[position()>1]').each do |node|
      data << { 'date' => node.children[0].content.delete(' '),
                'out'  => node.children[2].content,
                'in'   => node.children[4].content }
    end
    return data
  end

end

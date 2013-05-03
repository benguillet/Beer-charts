class User

  @connected = false

  def initialize(login, password)
    @login = login
    @password = password
    connection!
  end

  def connection!
    #TODO Connect to the website
  end

  def connected?
    return @connected  
  end

  def getData criteria
    #TODO retreive data from website
  end
  
end

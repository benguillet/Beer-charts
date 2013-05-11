require 'sinatra'
require 'haml'
require 'yaml'
require 'json'
require './src/tools.rb'
require './src/user.rb'

set :views, File.dirname(__FILE__) + "/views"
set :public_folder, File.dirname(__FILE__) + '/resources'

post '/' do
  user = User.new(params[:login], params[:mdp])
  if user.connected?
    haml :stat, :locals => { :cookie => user.cookie }
  else
    haml :index, :locals => { :error => 'Une erreur est survenue !' }
  end
end

post '/get/montly' do
  user = User.initByCookie(params[:cookie])
  if user.connected?
    user.getMonthlyBalance().to_json
  end
end 

post '/get/all' do
  user = User.initByCookie(params[:cookie])
  if user.connected?
    user.getAllData(params[:data]).to_json
  end
end

get '/' do
  haml :index
end

not_found do  
  halt 404, 'page not found'  
end 

# Windows setup
```
choco install ruby --version=2.7.2.1
choco install graphicsmagick
gem install jekyll bundler
gem uninstall eventmachine
gem install eventmachine --platform ruby
bundle install
bundle update --all
bundle exec jekyll serve --livereload
```
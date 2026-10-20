-- PREAMAR — o vídeo do hero passa a ser servido pelo próprio site (public/media),
-- comprimido (5,6 MB em vez de 27 MB, 2 MB no telemóvel), em vez do Supabase Storage.
-- Resolve o excesso de "Cached Egress" do plano gratuito.
update site_content set hero_video_url = '/media/hero-1080.mp4' where id = 1;

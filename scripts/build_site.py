"""Render the static site from the final DOCX transcription. No dependencies."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
DATA = json.loads((ROOT / 'content/site-content.json').read_text())
P = DATA['paragraphs']
BASE = 'https://equipeponte.vercel.app'
MENU = [('Home','index.html'),('A Equipe','a-equipe.html'),('O Grupo','o-grupo.html'),('Oficinas','oficinas.html'),('Textos e publicações','textos-e-publicacoes.html'),('Eventos e exposições','eventos-e-exposicoes.html'),('Contato','contato.html')]
ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def button(text, href, variant='primary'):
    return f'<a class="button button--{variant}" href="{href}">{text}<span class="button__icon">{ARROW}</span></a>'

def brand(footer=False):
    if footer:
        return '<a class="brand brand--footer" href="index.html" aria-label="Equipe Ponte — Home"><img src="assets/images/logo-horizontal.png" width="1436" height="597" alt=""></a>'
    return '<a class="brand" href="index.html" aria-label="Equipe Ponte — Home"><img src="assets/images/logo.png" width="48" height="48" alt=""><span>equipe <strong>ponte</strong></span></a>'

def header(current):
    links=''.join(f'<a href="{url}"'+(' aria-current="page"' if url==current else '')+(' class="nav-contact"' if url=='contato.html' else '')+f'>{name}</a>' for name,url in MENU)
    return f'<header class="site-header">{brand()}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"><span>Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="main-nav" aria-label="Navegação principal">{links}</nav></header>'

def head(title, description, current):
    url=BASE+('/' if current=='index.html' else '/'+current)
    schema={'@context':'https://schema.org','@type':'Organization','name':'Equipe Ponte','url':BASE,'email':'equipeponte@gmail.com','address':{'@type':'PostalAddress','streetAddress':'Rua Paris, 656, Sumaré','addressLocality':'São Paulo','addressRegion':'SP','postalCode':'01257-040','addressCountry':'BR'}}
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#081e29"><meta name="robots" content="noindex, nofollow"><title>{escape(title)} — Equipe Ponte</title><meta name="description" content="{escape(description,quote=True)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{escape(title,quote=True)} — Equipe Ponte"><meta property="og:description" content="{escape(description,quote=True)}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}/assets/images/equipe.webp"><link rel="icon" href="assets/images/logo.png"><link rel="preload" href="assets/fonts/switzer-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/victor-serif-medium-italic.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="assets/styles.css"><script src="assets/site-config.js" defer></script><script src="assets/site.js" defer></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script><link rel="stylesheet" href="assets/motion.css"><script src="assets/vendor/gsap.min.js" defer></script><script src="assets/vendor/ScrollTrigger.min.js" defer></script><script src="assets/vendor/lenis.min.js" defer></script><script src="assets/motion.js" defer></script></head><body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a>'''

def footer():
    links=''.join(f'<a href="{url}">{name}</a>' for name,url in MENU)
    return f'<footer class="footer wrap"><div class="footer-top">{brand(footer=True)}<a href="#conteudo">Voltar ao início ↑</a></div><nav class="footer-nav" aria-label="Navegação do rodapé">{links}</nav><div class="footer-bottom"><span>© 2026 Equipe Ponte</span><nav class="footer-social" aria-label="Redes sociais e email"><a href="mailto:equipeponte@gmail.com" aria-label="Enviar email à Equipe Ponte"><span class="footer-social-icon footer-social-icon--email" aria-hidden="true"></span></a><a href="https://www.facebook.com/equipeponte/" aria-label="Equipe Ponte no Facebook"><span class="footer-social-icon footer-social-icon--facebook" aria-hidden="true"></span></a><a href="https://www.instagram.com/equipeponte/" aria-label="Equipe Ponte no Instagram"><span class="footer-social-icon footer-social-icon--instagram" aria-hidden="true"></span></a></nav></div></footer></body></html>'

def para(i):
    text=escape(P[i])
    if i == 70:
        text=text.replace("Rua Paris, 656 - Sumaré (CEP01257-040)", '<strong class="contact-address-emphasis">Rua Paris, 656 - Sumaré (CEP01257-040)</strong>').replace("</strong>, ", "</strong>,<br> ")
    # Link only the navigation references present in the source, preserving words.
    mapping={5:[('o grupo','o-grupo.html')],9:[('oficinas','oficinas.html')],10:[('textos e publicações','textos-e-publicacoes.html')],11:[('a equipe','a-equipe.html')],12:[('contato','contato.html')],23:[('oficinas','oficinas.html')],31:[('textos e publicações','textos-e-publicacoes.html')],49:[('o GRUPO','o-grupo.html'),('OFICINAS','oficinas.html')],67:[('CONTATO','contato.html')]}
    for label,href in mapping.get(i,[]):
        pos=text.rfind(label)
        if pos>=0:text=text[:pos]+f'<a href="{href}">{label}</a>'+text[pos+len(label):]
    return f'<p data-source-paragraph="{i}">{text}</p>'

def paragraphs(indices):
    return ''.join(para(i) for i in indices)

def picture(name, alt, caption='', width=1200, height=900, eager=False):
    return f'<figure class="editorial-photo"><img src="assets/images/{name}.webp" srcset="assets/images/{name}-small.webp 700w, assets/images/{name}.webp {width}w" sizes="(max-width: 900px) 90vw, 900px" width="{width}" height="{height}" alt="{escape(alt,quote=True)}" loading="'+('eager' if eager else 'lazy')+'">'+(f'<figcaption>{caption}</figcaption>' if caption else '')+'</figure>'

def page(title,description,current,body,subtitle='',extra_class=''):
    if 'contact-section small-contact' not in body: body += cta()
    intro=f'<section class="page-intro wrap"><a class="breadcrumb" href="index.html">Home <span aria-hidden="true">/</span></a><h1>{title}</h1>'+(f'<p>{subtitle}</p>' if subtitle else '')+'</section>'
    if current == "a-equipe.html":
        intro = intro.replace("</section>", '<figure class="editorial-photo team-presence-art"><img src="assets/images/arte-pedro-m.webp" width="1672" height="941" alt="Desenho de Pedro M. com figuras humanas e nomes dos participantes do grupo Ponte" loading="eager"><figcaption>Lista de presenças e ausências no grupo Ponte - Pedro M.</figcaption></figure>' + "</section>")
    header_class = "inner-header inner-header--content" if current in ('a-equipe.html', 'o-grupo.html', 'oficinas.html', 'textos-e-publicacoes.html', 'eventos-e-exposicoes.html', 'contato.html') else "inner-header"
    PUBLIC.joinpath(current).write_text(head(title,description,current)+f'<div class="{header_class}">{header(current)}</div><main id="conteudo" class="{extra_class}">'+intro+body+'</main>'+footer())

def cta():
    return '<section class="contact-section small-contact"><div class="wrap contact-inner"><p class="overline">Contato</p><div class="home-contact-heading"><img class="home-section-icon home-section-icon--contact" src="assets/images/contact-icon.png" width="144" height="216" alt="" loading="lazy"><h2>Escreva <em>para nós.</em></h2></div>'+button('Fale com a equipe','contato.html','mint')+'</div></section>'

# Home: full source paragraphs, arranged into editorial sections.
hero='<section class="hero" aria-labelledby="hero-title"><canvas class="hero-fluid" aria-hidden="true"></canvas><script src="assets/hero-fluid.js" defer></script>'+header('index.html')+'''<div class="hero__content"><p class="hero__eyebrow"><span class="status-dot"></span>Desde 2012</p><p class="hero__intro">Equipe Ponte</p><h1 id="hero-title">Psicanálise e<br> trabalho em grupo.</h1><p class="hero__description">Crianças, adolescentes e jovens adultos.<br>Novas formas de expressão e relação com o mundo.</p><div class="hero__actions">'''+button('Conheça a Ponte','#sobre','light')+'<a class="quiet-link" href="contato.html">Fale com a equipe</a></div></div><a class="hero__scroll" href="#sobre">Explore <span aria-hidden="true">↓</span></a></section>'
body=hero+'<section class="section wrap" id="sobre"><div class="section-heading centered"><p class="overline">A Ponte</p><h2>Uma proposta clínica.<br><em>Um trabalho em grupo.</em></h2></div><div class="editorial-grid"><div class="prose">'+paragraphs([3,4])+ '</div>'+picture('obra-gabriel','Obra de Gabriel N.: pintura abstrata em azul, vermelho e tons claros','Obra de Gabriel N.',1440,1080)+'</div></section>'
body+='<section class="group-section section" id="grupo"><div class="wrap reading-layout"><div class="reading-aside"><img class="home-section-icon" src="assets/images/grupo-icon.png" width="120" height="180" alt="" loading="lazy"><h2><em>O grupo</em></h2>'+button('Conheça o grupo','o-grupo.html','outline')+'</div><div class="prose">'+para(5)+'</div></div></section>'
body+='<section class="section wrap reading-layout" id="oficinas"><div class="reading-aside"><p class="overline">As oficinas</p><h2>Expressão<br><em>e descoberta.</em></h2>'+button('Conheça as oficinas','oficinas.html')+'<img class="home-section-icon" src="assets/images/search-icon.png" width="120" height="180" alt="" loading="lazy"></div><div class="prose">'+paragraphs([6,7,8,9])+'</div></section>'
body+='<section class="section team-section" id="equipe"><div class="wrap reading-layout"><div class="reading-aside"><p class="overline">Conheça</p><h2>Pesquisa,<br><em>clínica e encontros.</em></h2><img class="home-section-icon" src="assets/images/reunion-icon.png" width="120" height="180" alt="" loading="lazy"></div><div class="prose">'+paragraphs([10,11,12,13,14])+'</div></div></section>'+cta()
PUBLIC.joinpath('index.html').write_text(head('Psicanálise e trabalho em grupo','Desde 2012, a Equipe Ponte desenvolve uma proposta clínica de psicanálise, trabalho em grupo e oficinas terapêuticas em São Paulo.','index.html')+'<main id="conteudo">'+body+'</main>'+footer())

# Team: three founders transcribed from the embedded image, followed by four profiles.
team=[('Julia Fatio Vasconcelos','Psicanalista','Membro-fundadora e coordenadora dos grupos da Equipe Ponte'),('Manuela B.C.','Psicanalista','Membro-fundadora e coordenadora dos grupos da Equipe Ponte'),('Marcela Morgado Cury','Psicanalista','Membro-fundadora e coordenadora dos grupos da Equipe Ponte'),(P[52],P[53],P[54]),(P[56],P[57],P[58].replace(' desde 2023','')),(P[59],P[60],P[61]),(P[63],P[64],P[65])]
profiles=''.join(f'<article class="person-card"><span class="person-mark" aria-hidden="true">{name[0]}</span><h3>{escape(name)}</h3><p>{role}</p><p>{responsibility}</p></article>' for name,role,responsibility in team)
body='<section class="wrap team-overview">'+picture('equipe','Giovanna, Julia, Ligia, Marcela, Silvia, Ivens e Manuela, integrantes da Equipe Ponte','Foto: Giovanna, Julia, Ligia, Marcela, Silvia, Ivens e Manuela - A Equipe no XV Congresso Internacional de AT (Setembro/2026)',1170,596,True)+'<div class="prose prose--wide">'+para(49)+'</div></section><section class="section wrap"><div class="section-heading"><h2>A equipe</h2><p>Atualmente, a equipe conta com sete coordenadores:</p></div><div class="people-grid">'+profiles+'</div><div class="prose prose--wide"><p>A Equipe conta também com algumas parcerias (semestrais ou anuais) de estagiários de faculdades de Psicologia da cidade de São Paulo e de mestrandos da USP.</p>'+para(67)+'</div></section>'+cta()
page('A Equipe','Conheça as psicanalistas e os psicanalistas que compõem a Equipe Ponte.','a-equipe.html',body)

# Group.
body='<section class="wrap editorial-grid"><div class="prose">'+paragraphs([17,18,19])+'</div>'+picture('obra-pedro','Obra de Pedro M.: figuras humanas desenhadas em diversas cores','Obra de Pedro M.',640,640,True)+'</section><section class="section wrap reading-layout"><div class="reading-aside"><h2>Por que<br><em>em grupo?</em></h2></div><div class="prose">'+paragraphs([21,22,23])+'</div></section><section class="wrap schedule-note"><span class="icon-3d icon-3d--calendar" aria-hidden="true"></span><div><h2>Quartas e sextas-feiras</h2><p>Dois encontros semanais, com três horas de duração em cada dia.</p></div>'+button('Fale com a equipe','contato.html')+'</section>'+cta()
page('O Grupo','Conheça o trabalho em grupo da Equipe Ponte, sua trajetória e a proposta clínica orientada pela psicanálise.','o-grupo.html',body)

# Workshops, ordered exactly as in the DOCX.
workshops=[('Culinária','culinaria',38,'bridge'),('Pintura','pintura',40,'brush'),('Música','musica',42,'music'),('Dança','danca',44,'ribbon'),('Teatro','teatro',46,'connection')]
cards=''.join(f'<a class="photo-card" href="oficina-{slug}.html"><img src="assets/images/oficina-{slug}-small.webp" width="700" height="560" loading="lazy" alt="Registro da oficina de {name.lower()} da Equipe Ponte"><span><img class="workshop-title-icon" src="assets/images/{slug}-icon.png" width="44" height="44" alt="" loading="lazy"><strong>{name}</strong>{ARROW}</span></a>' for name,slug,index,icon in workshops)
body='<section class="wrap editorial-grid workshops-intro"><div><h2>Sustentação teórica<br><em>do trabalho com oficinas.</em></h2><div class="prose">'+paragraphs([27,28])+'</div></div>'+picture('obra-bianca','Obra de Bianca T.: pintura com formas orgânicas coloridas em moldura','Obra de Bianca T.',1600,1200,True)+'</section><section class="section wrap reading-layout"><div class="reading-aside"><h2>Sujeito<br><em>e voz.</em></h2></div><div class="prose">'+paragraphs([29,30,31])+'<aside class="source-notes">'+para(33)+'<h3>Referências bibliográficas</h3>'+para(35)+'</aside></div></section><section class="section group-section"><div class="wrap"><div class="section-heading"><h2>Conheça <em>cada oficina.</em></h2></div><div class="photo-grid">'+cards+'</div></div></section>'+cta()
page('Oficinas','A sustentação teórica e as oficinas de culinária, pintura, música, dança e teatro da Equipe Ponte.','oficinas.html',body)
for name,slug,index,icon in workshops:
    body='<section class="wrap workshop-detail"><div class="workshop-detail__image">'+picture('oficina-'+slug,'Registro da oficina de '+name.lower()+' da Equipe Ponte','Oficina de '+name.lower()+' · Equipe Ponte',1000,800,True)+'</div><div class="prose">'+para(index)+'</div></section><div class="wrap workshop-pagination">'+button('Todas as oficinas','oficinas.html','outline')+button('Fale com a equipe','contato.html')+'</div>'
    page('Oficina de '+name.lower(),'Conheça a oficina de '+name.lower()+' e seu lugar na proposta clínica da Equipe Ponte.','oficina-'+slug+'.html',body)

# Publications: no PDFs supplied. No fake titles or disabled download controls.
items=DATA.get('publications',[])
links=''.join(f'<a class="publication-link" href="{escape(x["file"],quote=True)}" target="_blank" rel="noopener">{escape(x["title"])} <span>PDF ↗</span></a>' for x in items)
body='<section class="wrap publications">'+(links if items else '<div class="publication-empty"><span class="icon-3d icon-3d--publications" aria-hidden="true"></span><p>As publicações estarão disponíveis em breve.</p></div>')+'</section>'
page('Textos e publicações','Textos e publicações da Equipe Ponte sobre a clínica psicanalítica e o trabalho com oficinas.','textos-e-publicacoes.html',body)

# Events: awaiting editorial content.
page('Eventos e Exposições','Eventos e exposições da Equipe Ponte.','eventos-e-exposicoes.html','<section class="wrap publications"><div class="publication-empty"><span class="icon-3d icon-3d--events" aria-hidden="true"></span><p>Em breve, acompanhe aqui os eventos e as exposições da Equipe Ponte.</p></div></section>'+cta())

# Contact with a truthful client-side email fallback until delivery is configured.
body='<section class="wrap contact-layout"><div class="contact-information"><div class="prose">'+para(70)+'</div><a class="contact-email-address" href="mailto:equipeponte@gmail.com">equipeponte@gmail.com</a>'+picture('sarau-2025','Sarau da Equipe Ponte em 2025','Sarau da Equipe Ponte em 2025',1170,838)+'</div><div class="form-panel"><h2>Escreva <em>para nós.</em></h2><form id="contact-form"><div class="form-field"><label for="contact-name">Nome</label><input id="contact-name" name="name" autocomplete="name" maxlength="100" required></div><div class="form-field"><label for="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div class="form-field"><label for="contact-message">Mensagem</label><textarea id="contact-message" name="message" rows="6" minlength="10" maxlength="5000" aria-describedby="message-hint" required></textarea><p id="message-hint" class="field-hint">Conte brevemente o motivo do contato. Evite incluir informações clínicas sensíveis.</p></div><div class="honeypot" aria-hidden="true"><label for="contact-company">Empresa</label><input id="contact-company" name="company" tabindex="-1" autocomplete="off"></div><p class="form-delivery-note" id="delivery-note">Ao continuar, seu aplicativo de e-mail será aberto com a mensagem preenchida. O envio é concluído por você no aplicativo.</p><button class="button button--primary" id="contact-submit" type="submit"><span>Abrir no meu e-mail</span><span class="button__icon">'+ARROW+'</span></button><p id="form-status" role="status" aria-live="polite"></p><noscript><p>Para escrever à equipe, envie um e-mail para <a href="mailto:equipeponte@gmail.com">equipeponte@gmail.com</a>.</p></noscript></form></div></section><section class="section wrap map-section"><div class="section-heading--split"><h2>Como <em>chegar.</em></h2><a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=Rua+Paris+656+Sumare+Sao+Paulo" target="_blank" rel="noopener">Abrir no Google Maps ↗<span class="sr-only"> (nova aba)</span></a></div><iframe title="Localização da Equipe Ponte na Rua Paris, 656, Sumaré, São Paulo" src="https://maps.google.com/maps?q=Rua%20Paris%20656%20Sumare%20Sao%20Paulo&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>'
page('Contato','Entre em contato com a Equipe Ponte. Rua Paris, 656, Sumaré, São Paulo. E-mail: equipeponte@gmail.com.','contato.html',body)
urls=[BASE+('/' if url=='index.html' else '/'+url) for _,url in MENU]+[BASE+'/oficina-'+slug+'.html' for _,slug,_,_ in workshops]
(PUBLIC/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+url+'</loc></url>' for url in urls)+'</urlset>\n')
print('Rendered 12 content pages from the final DOCX transcription.')

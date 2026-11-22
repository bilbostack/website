+++
title = 'La Espuela'
description = 'La Espuela de BilboStack 2027 en el estadio de San Mamés: bebida, comida, música en directo y sorteos, de 14:00 a 20:00. Incluido con tu entrada.'
type = 'networking'
seoTitle = "La Espuela en San Mamés · BilboStack 2027"
seoDescription = "La Espuela, la tarde del sábado de BilboStack 2027, se juega en San Mamés: networking, bebida, comida, música en directo y sorteos de 14:00 a 20:00. Incluido con tu entrada."
image = 'img/networking/og-la-espuela.jpg'   # social share (og:image / X card): San Mamés + La Espuela, 1200×630
heading = "La Espuela se juega en San Mamés"
lead = "Cuando terminen las charlas, nos vamos a La Catedral: un espacio dentro del estadio de San Mamés para seguir la conversación con algo de beber, algo de comer, música en directo y sorteos."
venueText = "San Mamés es mucho más que un estadio: es uno de los iconos de Bilbao. Este año La Espuela de BilboStack se muda a un espacio dentro de La Catedral, a un paseo del Palacio Euskalduna."
transport = "Metro San Mamés (L1 · L2) · Tranvía San Mamés"
# Foto del estadio en el hero (en lugar de la ilustración). Licencia CC BY 3.0: el crédito
# (`venueImageCredit`) es obligatorio y se muestra sobre la foto. `venueImageFocus` = object-position.
venueImage = 'img/networking/san-mames-photo.jpg'
venueImageAlt = "Vista aérea del estadio de San Mamés junto a la ría de Bilbao, con la ciudad y los montes al fondo."
venueImageFocus = '50% 62%'
venueImageCredit = { title = "San Mames Barria eta Bilboko ikuspegia", author = "Mikel Arrazola (Irekia)", url = "https://commons.wikimedia.org/wiki/File:San_Mames_Barria_eta_Bilboko_ikuspegia.jpg", license = "CC BY 3.0", licenseUrl = "https://creativecommons.org/licenses/by/3.0/deed.es" }
# Acceso al espacio de networking dentro del estadio. Vacío = "Pendiente" en la web.
access = { gate = "", space = "" }

# Programa de la tarde (columna derecha del hero). `time` = hora de inicio de cada
# tramo; el último dura hasta networking.end (hugo.toml). Mismo orden en los tres idiomas.
schedule = [
  { time = "14:00", title = "Llegada, comida y networking", text = "Comemos y arrancan las conversaciones, con un DJ tranquilo de fondo." },
  { time = "16:30", title = "Dinamizaciones", text = "Un Kahoot con la historia de BilboStack (con sorteo), concursos y actividades para la comunidad, y música en directo entre una y otra." },
  { time = "18:30", title = "Música y tardeo", text = "La tarde sigue con música hasta el pitido final." },
]

# Alineación de la tarde. El orden es el visual en móvil (el capitán queda en el
# centro, sobre el círculo central). `position` lo coloca sobre el campo en escritorio:
# left-top, left-bottom, center, right-top, right-bottom. `icon`: drinks, food,
# networking, music, raffle. `notIncluded = true` marca con asterisco lo que no entra en la
# entrada (nota i18n `nw_drinks_note`); `note` pone asterisco con una nota propia.
# Mantener el mismo orden en los tres idiomas.
lineup = [
  { position = "left-top", icon = "drinks", notIncluded = true, title = "Bebida con y sin alcohol", text = "Algo para brindar por las charlas del día y por todo lo que está por venir." },
  { position = "left-bottom", icon = "food", note = "Algo habrá", title = "Comida", text = "Para reponer fuerzas tras la jornada y que ninguna conversación se quede a medias." },
  { position = "center", icon = "networking", captain = true, title = "Networking", text = "El corazón del BilboStack. Reencuentros, caras nuevas y conexiones que empiezan con un «¿y tú a qué te dedicas?»." },
  { position = "right-top", icon = "music", title = "Música en directo", text = "Banda sonora en vivo para toda la tarde." },
  { position = "right-bottom", icon = "raffle", title = "Sorteos", text = "Habrá sorteos durante la tarde, así que no te vayas antes del pitido final." },
]
+++

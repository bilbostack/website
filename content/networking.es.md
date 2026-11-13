+++
title = 'Networking'
description = 'Networking de BilboStack 2027 en el estadio de San Mamés: bebida, comida, música en directo y sorteos, de 14:00 a 20:00.'
type = 'networking'
seoTitle = "Networking en San Mamés · BilboStack 2027"
seoDescription = "La tarde del sábado de BilboStack 2027 se juega en San Mamés: networking, bebida, comida, música en directo y sorteos de 14:00 a 20:00."
image = 'img/bilbostack_publico.webp'   # social share (og:image)
heading = "La segunda parte se juega en San Mamés"
lead = "Cuando terminen las charlas, nos vamos a La Catedral: un espacio dentro del estadio de San Mamés para seguir la conversación con algo de beber, algo de comer, música en directo y sorteos."
venueText = "San Mamés es mucho más que un estadio: es uno de los iconos de Bilbao. Este año el networking de BilboStack se muda a un espacio dentro de La Catedral, a un paseo del Palacio Euskalduna."
transport = "Metro San Mamés (L1 · L2) · Tranvía San Mamés"
# Acceso al espacio de networking dentro del estadio. Vacío = "No definido" en la web.
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
# networking, music, raffle. Mantener el mismo orden en los tres idiomas.
lineup = [
  { position = "left-top", icon = "drinks", title = "Bebida", text = "Algo para brindar por las charlas del día y por todo lo que está por venir." },
  { position = "left-bottom", icon = "food", title = "Comida", text = "Para reponer fuerzas tras la jornada y que ninguna conversación se quede a medias." },
  { position = "center", icon = "networking", captain = true, title = "Networking", text = "El corazón de BilboStack: reencuentros, caras nuevas y conversaciones que empiezan con un «¿y tú a qué te dedicas?» y acaban en proyecto." },
  { position = "right-top", icon = "music", title = "Música en directo", text = "Banda sonora en vivo para toda la tarde." },
  { position = "right-bottom", icon = "raffle", title = "Sorteos", text = "Habrá sorteos durante la tarde, así que no te vayas antes del pitido final." },
]
+++

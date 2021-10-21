const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const prefix = "-"

const ytdl = require('ytdl-core');
const { 
    joinVoiceChannel,
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource    
} = require('@discordjs/voice')

require('dotenv').config()

client.once('ready', () => {
    console.log('Bot Despegado!')
})

//client.on("error", (e) => console.error(e));

//client.on("warn", (e) => console.warn(e));

//client.on("debug", (e) => console.info(e));

client.on("guildMemberAdd", (member) => {
    console.log(`Nuevo usuario:  ${member.user.username} se ha unido a ${member.guild.name}.`);
    
    let channel = client.channels.get('898013047745036298'); 
    channel.send(`${member.user}, bienvenido al servidor pasala bien.`);
    
 });

client.on('message', async (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Si el autor de un mensaje es un bot, previene la propagacion del evento
    if(!message.content.startsWith(prefix)) return
    if (message.author.bot) return

    //Comando de Presentacion
    if( command === 'hola' ) {
        message.channel.send('Mi nombre es Botito el Bot y acabo de llegar :D')
    } 
    
    //Comando de Ping-Pong
    if (command === 'ping') {
        let ping = Math.floor(message.client.ping);
        
        message.channel.send(":ping_pong: Pong!")
          .then(m => {
              m.edit(`:incoming_envelope: Ping Mensajes: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
          });
    } 
    
    //Comando de Ayuda
    if(command === 'ayuda') {
        message.channel.send('**'+message.author.username+'**, aqui estan mis comandos.');
        message.channel.send('**COMANDOS**\n```\n'+
            '-> '+prefix+'hola            = El bot se presenta. \n' +
            '-> '+prefix+'ping            = Comprueba la latencia del bot y de tus mensajes.\n'+
            '-> '+prefix+'server          = Muestra información de servidor determinado.\n'+
            '-> '+prefix+'dime            = El bot respondera a tus preguntas.\n'+
            '-> '+prefix+'ban <@user>     = Banear a un usuario del servidor,  incluye razon.\n'+
            '-> '+prefix+'kick <@user>    = Patear a un usuario del servidor, incluye razon.\n'+
            '-> '+prefix+'usuario <@user> = Ofrece informacion del usuario.\n```\n\n');
    }
    
    //Comando de Echar
    if (command === 'kick') {
        let user = message.mentions.users.first();
        let reason = args.slice(1).join(' ')

        if (message.mentions.users.size < 1) {
            try {
                return message.reply('Menciona un usuario...')
            } catch (message_1) {
                return console.error(message_1)
            }
        }

        if (!reason) {
            return message.channel.send('Escriba una razón, `-kick @username [razón]`')
        }
        
        if (!message.guild.members.kick(user)) {
            return message.reply('No puedo correr a ese usuario :(')
        }

        message.guild.members.kick(user)

        message.channel.send(`**${user.username}**, fue pateado del servidor, razón: ${reason}.`)
        
    } 
    
    //Comando de Baneo
    if(command === 'ban'){
        let user = message.mentions.users.first();
        let razon = args.slice(1).join(' ');
    
        if (message.mentions.users.size < 1) {
            try {
                return message.reply('Debe mencionar a alguien.')
            } catch (message_1) {
                return console.error(message_1)
            }
        }

        if(!razon) {
            return message.channel.send('Escriba un razón, `-ban @username [razón]`');
        }

        if (user !== message.author) {
            message.guild.members.ban(user);
            message.author.send(`**${user.username}**, fue baneado del servidor`)
            message.channel.send(`**${user.username}**, fue baneado del servidor, razón: ${razon}.`);
        } else {
            return message.reply('No puedes banearte')
        }
    }

    //Comando de Desbaneo
    if(command === 'unban'){
        let userId = args.slice(1).join(' ');

        if(!userId) {
            return message.channel.send('No existe el usuario');
        }

        
        //message.guild.members.unban(userId)

        message.channel.send('Usuario desbaneado')
    }

    //Comando de Server
    if(command === 'server'){
        let server = message.guild

        const exampleEmbed = {
            color: 0x0099ff,
	        title: server.name,
	        description: 'Informacion del Servidor',
	        fields: [
	        	{
	        		name: '\u200b',
	        		value: '\u200b',
	        	},
                {
	        		name: 'Nombre del servidor: ',
	        		value: server.name,
	        	},
	        	{
	        		name: 'Id del servidor: ',
	        		value: server.id,
	        	},
	        	{
	        		name: 'Creado el: ',
	        		value: server.joinedAt.toDateString(),
	        	},
                
                {
	        		name: '\u200b',
	        		value: '\u200b',
	        	},
	        ],
	        timestamp: new Date(),
	        footer: {
	        	text: 'Copyright DevJay',
	        },
        }

        message.channel.send({ embeds: [exampleEmbed] });
    }

    //Comando que responde aleatoreamente
    let text = args.join(' ')

    if (command === 'dime') {
        let answers = ['Si', 'No', 'Porque preguntas?', 'Porque si!', 'Tal vez', 'Mmm no lo se, tu dime']

        if (!text) {
            return message.reply('Escribe una pregunta')
        }

        message.channel.send( answers[Math.floor(Math.random() * answers.length)] )
    }

    //Comando que proporciona informacion del usuario
    if(command === 'usuario') {
        let userMentioned = message.mentions.users.first()

        if (message.mentions.users.size < 1) {
            try {
                return message.reply('Debe mencionar a alguien.')
            } catch (message_1) {
                return console.error(message_1)
            }
        }

        const embedUser = {
            color: 0x66b3ff,
            title: userMentioned.username,
            description: 'Informacion del Usuario',
            fields: [
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: 'Nombre del Usuario',
                    value: userMentioned.username,
                },
                {
                    name: 'Discord Tag',
                    value: userMentioned.discriminator,
                },
                {
                    name: 'Id del usuario',
                    value: userMentioned.id,
                },
                {
                    name: 'Cuenta creada el',
                    value: userMentioned.createdAt.toDateString(),
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
            ],
            timestamp: new Date(),
            footer: {
                text: 'Copyright DevJay',
            },
        }

        message.channel.send({ embeds: [embedUser] });    
    }

    //Comando que reproduce musica
    if (command === 'yt') { 
        let songName = args.slice(1).join(' ');

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        const stream = ytdl(songName, {filter: 'audioonly'} )
        const player = createAudioPlayer();
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        
        stream.on('error', e => {
            console.error(e)
            message.channel.send('Hubo un error')
        })

        player.play(resource)
        connection.playOpusPacket(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Hay musica!');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('No hay audio')
        })

        player.on(AudioPlayerStatus.Buffering, () => {
            console.log('En espera')
        })
    }
})




client.login(process.env.BOT_TOKEN)
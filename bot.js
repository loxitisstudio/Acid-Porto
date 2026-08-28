import 'dotenv/config';
import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Inisialisasi Bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Definisi Struktur Slash Command
const commands = [
  new SlashCommandBuilder()
    .setName('addproject')
    .setDescription('Menambahkan project portofolio baru ke database')
    // --- OPSI WAJIB ---
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Judul project')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Pilih kategori project')
        .setRequired(true)
        .addChoices(
          { name: 'Motion Graphics', value: 'MOTION GRAPHICS' },
          { name: 'Video Editing', value: 'VIDEO EDITING' },
          { name: 'Design', value: 'DESIGN' },
          { name: '3D Render', value: '3D RENDER' },
          { name: 'Roblox Development', value: 'ROBLOX DEVELOPMENT' }
        ))
    .addStringOption(option =>
      option.setName('year')
        .setDescription('Tahun project (contoh: 2026)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('Link gambar thumbnail')
        .setRequired(true))
    // --- OPSI OPSIONAL ---
    .addStringOption(option =>
      option.setName('videourl')
        .setDescription('Link file video (tanpa suara)'))
    .addStringOption(option =>
      option.setName('audiourl')
        .setDescription('Link file audio terpisah'))
    .addStringOption(option =>
      option.setName('role')
        .setDescription('Peran kamu di project ini'))
    .addStringOption(option =>
      option.setName('software')
        .setDescription('Software yang digunakan'))
    .addStringOption(option =>
      option.setName('desc')
        .setDescription('Deskripsi project'))
].map(command => command.toJSON());

client.on('clientReady', async () => {
  console.log(`Bot logged in as ${client.user.tag}!`);

 const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Mendaftarkan global slash commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Berhasil mendaftarkan global slash commands!');
  } catch (error) {
    console.error("Gagal register command:", error);
  }
});

// Event listener untuk menangkap slash command
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'addproject') {
    const title = interaction.options.getString('title');
    const category = interaction.options.getString('category');
    const year = interaction.options.getString('year');
    const role = interaction.options.getString('role');
    const software = interaction.options.getString('software');
    const desc = interaction.options.getString('desc');
    const thumbnail = interaction.options.getString('thumbnail');
    const videoUrl = interaction.options.getString('videourl');
    const audioUrl = interaction.options.getString('audiourl'); // <-- Ditambahkan agar variabelnya ada

    // Masukkan ke Supabase
    const { error } = await supabase
      .from('projects')
      .insert([
        {
          title: title,
          category: category,
          year: year,
          role: role,
          software: software,
          desc: desc,
          thumbnail: thumbnail,
          "videoUrl": videoUrl,
          "audioUrl": audioUrl, // <-- Sekarang sudah terhubung dengan variabel di atas
        }
      ]);

    if (error) {
      console.error("Error detail Supabase:", error);
      await interaction.reply({ content: 'Gagal menyimpan project ke database!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Project beserta audio berhasil ditambahkan ke database & website!', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
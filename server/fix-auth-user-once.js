require('dotenv').config();
const supabase = require('./lib/supabaseClient');

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  const user = data.users.find((u) => u.email === 'orsolomon24@gmail.com');
  if (!user) {
    console.log('User not found');
    return;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    email: 'amit@mykitchen.local',
    email_confirm: true,
  });
  if (updateError) throw updateError;

  console.log('Updated user email to amit@mykitchen.local');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

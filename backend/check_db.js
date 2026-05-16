import db from './src/config/database.js';

try {
  const result = await db.$queryRawUnsafe('SELECT NOW() as time, current_database() as dbname');
  console.log('✅ Database Connected!');
  console.log('   Database:', result[0].dbname);
  console.log('   Server Time:', result[0].time);

  const userCount = await db.user.count();
  const projectCount = await db.project.count();
  const taskCount = await db.task.count();

  console.log('');
  console.log('📊 Database Stats:');
  console.log('   Users:', userCount);
  console.log('   Projects:', projectCount);
  console.log('   Tasks:', taskCount);
} catch (e) {
  console.error('❌ Connection Failed:', e.message);
}

process.exit(0);

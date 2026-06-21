const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Models
const Event = require('./models/Event');
const Team = require('./models/Team');
const StudentBranch = require('./models/StudentBranch');
const Resource = require('./models/Resource');
const Blog = require('./models/Blog');
const Exam = require('./models/Exam');
const Message = require('./models/Contact');
const { 
    LiveUpdate, HeroSlide, Counter, Karnataka, 
    GifSection, ChairMessage, HomeGallery, HomeUpdate, 
    Activity, MembershipCategory, Advantage, JoinStep, 
    FocusArea, SocialLink, AboutIntro, PageContent 
} = require('./models/HomeModels');

dotenv.config();

const restoreData = async () => {
    const backupFolderName = process.argv[2];
    if (!backupFolderName) {
        console.error('❌ Please provide the backup folder name (e.g., node restore.js backup-2026-05-02T09-30-00-000Z)');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee-tems');
        console.log('Connected to MongoDB for Restore...');

        const backupPath = path.join(__dirname, 'backup', backupFolderName);
        if (!fs.existsSync(backupPath)) {
            console.error(`❌ Backup folder not found: ${backupPath}`);
            process.exit(1);
        }

        const collections = [
            { model: Event, name: 'events' },
            { model: Team, name: 'teams' },
            { model: StudentBranch, name: 'studentbranches' },
            { model: Resource, name: 'resources' },
            { model: Blog, name: 'blogs' },
            { model: Exam, name: 'exams' },
            { model: Message, name: 'contacts' },
            { model: LiveUpdate, name: 'liveupdates' },
            { model: HeroSlide, name: 'heroslides' },
            { model: Counter, name: 'counters' },
            { model: Karnataka, name: 'karnatakas' },
            { model: GifSection, name: 'gifsections' },
            { model: ChairMessage, name: 'chairmessages' },
            { model: HomeGallery, name: 'homegalleries' },
            { model: HomeUpdate, name: 'homeupdates' },
            { model: Activity, name: 'activities' },
            { model: MembershipCategory, name: 'membershipcategories' },
            { model: Advantage, name: 'advantages' },
            { model: JoinStep, name: 'joinsteps' },
            { model: FocusArea, name: 'focusareas' },
            { model: SocialLink, name: 'sociallinks' },
            { model: AboutIntro, name: 'aboutintros' },
            { model: PageContent, name: 'pagecontents' }
        ];

        console.log(`\n⏪ STARTING DATABASE RESTORE (Safety: No Overwrite)...`);
        
        for (const col of collections) {
            const filePath = path.join(backupPath, `${col.name}.json`);
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️ Skipped ${col.name} (file missing in backup)`);
                continue;
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let skipCount = 0;
            let insertCount = 0;

            for (const item of data) {
                // Delete ID to let MongoDB generate new ones or avoid conflict
                delete item._id; 
                delete item.__v;

                // Simple check: for most models, if a record with same title/name exists, skip
                const query = {};
                if (item.name) query.name = item.name;
                else if (item.title) query.title = item.title;
                else if (item.text) query.text = item.text;
                else if (item.label) query.label = item.label;

                const exists = Object.keys(query).length > 0 ? await col.model.findOne(query) : null;

                if (!exists) {
                    await col.model.create(item);
                    insertCount++;
                } else {
                    skipCount++;
                }
            }

            console.log(`✅ ${col.name}: Restored ${insertCount} records. Skipped ${skipCount} duplicates.`);
        }

        console.log(`\n🎉 RESTORE COMPLETE!\n`);
        process.exit(0);
    } catch (err) {
        console.error('Restore failed:', err);
        process.exit(1);
    }
};

restoreData();
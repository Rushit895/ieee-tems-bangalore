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

const backupData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee-tems');
        console.log('Connected to MongoDB for Backup...');

        const backupDir = path.join(__dirname, 'backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const exportDir = path.join(backupDir, `backup-${timestamp}`);
        fs.mkdirSync(exportDir);

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

        console.log(`\n📦 STARTING DATABASE BACKUP...`);
        
        for (const col of collections) {
            const data = await col.model.find({});
            const filePath = path.join(exportDir, `${col.name}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Exported ${data.length} records to ${col.name}.json`);
        }

        console.log(`\n🎉 BACKUP SUCCESSFUL! Folder: ${exportDir}\n`);
        process.exit(0);
    } catch (err) {
        console.error('Backup failed:', err);
        process.exit(1);
    }
};

backupData();
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Home = () => {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-6 md:pb-20">
      <div className="mb-8 flex flex-col items-center gap-5 md:flex-row md:gap-12">
        <div className="flex-1">
          <h1 className="mb-4 text-xl font-bold text-primary md:text-2xl">אתר המתכונים של עמיתי</h1>
          <p className="mb-5 text-md leading-relaxed text-text">
            ברוכים הבאים לאתר המתכונים <strong className="text-primary">המיוחד</strong> שלי! זהו המקום בו אני מאחסנת את כל <strong className="text-primary">האוצרות הקולינריים</strong> שלי - מתכונים מסורתיים שעברו במשפחה מדור לדור, המצאות מטבח מקוריות שלי, ומתכונים חדשים שגיליתי ואהבתי.
          </p>
          <Link to="/foodCategories">
            <Button variant="primary">לכל המתכונים</Button>
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src="/homepic.jpg"
            alt="תמונת נושא של האתר"
            className="max-w-full rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="rounded-lg bg-surface p-5 shadow-sm md:p-6">
        <p className="mb-4 leading-loose text-text">
          האתר הזה נולד מתוך <strong className="text-primary">אהבתי העזה לבישול ולאפייה</strong>. כל מתכון כאן מספר סיפור - אם זה המרק המנחם של סבתא, העוגה שאפיתי לראשונה כשהייתי ילדה, או המנה החדשנית שהמצאתי אתמול בלילה. כל אחד מהם הוא חלק ממסע הטעמים האישי שלי.
        </p>

        <p className="mb-4 leading-loose text-text">
          מעבר להיותו ארכיון דיגיטלי למתכונים שלי, האתר הזה הוא גם הדרך שלי <strong className="text-primary">לחלוק את אהבתי לאוכל עם העולם</strong>. אני מאמינה שאוכל הוא יותר מסתם מזון - הוא מחבר בין אנשים, יוצר זיכרונות, ומביא שמחה.
        </p>

        <p className="mb-4 leading-loose text-text">
          כמובן, אחת המטרות העיקריות של האתר היא לרכז את כל <strong className="text-primary">המתכונים האהובים על בן זוגי</strong> במקום אחד. ככה אני יכולה בקלות למצוא ולהכין את המנות האהובות עליו, ולהפתיע אותו מדי פעם עם משהו חדש ומרגש.
        </p>

        <p className="mb-4 leading-loose text-text">
          אני מזמינה אתכם לשוטט באתר, לגלות מתכונים חדשים, ואולי אפילו למצוא <strong className="text-primary">השראה למסע קולינרי משלכם</strong>. אל תהססו לנסות את המתכונים, לשנות אותם לטעמכם, ובעיקר - ליהנות מהתהליך ומהתוצאה!
        </p>

        <p className="mb-0 leading-loose text-text">
          מקווה שתמצאו כאן הרבה טעמים, רעיונות והשראה. <strong className="text-primary">בתיאבון!</strong>
        </p>
      </div>
    </div>
  );
};

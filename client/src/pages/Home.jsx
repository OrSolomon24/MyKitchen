import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBookOpen, FaLink, FaFolderOpen } from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { DishCard } from '../components/common/DishCard';
import { DishCardSkeleton } from '../components/skeletons/DishCardSkeleton';
import { useAuth } from '../context/AuthContext';
import { useDishes } from '../api/useDishesQueries';

const FEATURES = [
  {
    icon: FaBookOpen,
    title: 'ארכיון אישי',
    text: 'לכל אחד במשפחה ארכיון משלו — המתכונים שלך שמורים ונגישים מכל מכשיר.',
  },
  {
    icon: FaLink,
    title: 'ייבוא חכם מקישור',
    text: 'מדביקים קישור למתכון מהרשת — והוא נשמר אצלנו, מסודר ומוכן לבישול.',
  },
  {
    icon: FaFolderOpen,
    title: 'קטגוריות מותאמות',
    text: 'מרקים, קינוחים, שבת — מסדרים את המטבח בדיוק איך שנוח לנו.',
  },
];

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: dishes = [], isLoading } = useDishes({ enabled: isAuthenticated });
  const featured = dishes.slice(0, 4);

  const openDish = (dish) => {
    navigate(`/recipe/${dish.id}`, {
      state: { dish, categoryId: null, categoryName: '' },
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 pb-14 pt-8 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:pb-20 md:pt-14">
        <div>
          <p className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-wide text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            יומן מתכונים ביתי
          </p>
          <h1 className="mb-5 font-display text-[clamp(2.1rem,5.5vw,3.4rem)] font-black leading-[1.15] text-ink">
            אתר המתכונים
            <br />
            <span className="relative inline-block">
              של עמיתי
              <svg
                viewBox="0 0 200 12"
                aria-hidden="true"
                className="absolute -bottom-2 start-0 h-3 w-full text-accent"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 8 Q60 2 100 6 T196 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
          </h1>
          <p className="mb-7 max-w-[52ch] text-md leading-relaxed text-text-muted">
            האתר הזה נולד כיומן המתכונים של עמית — והיום כל המשפחה כאן. לכל אחד ואחת
            פינה משלו: מתכונים מסורתיים שעברו מדור לדור, המצאות מטבח מקוריות, וגילויים
            חדשים שאהבנו.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/foodCategories">
              <Button variant="primary">לכל המתכונים</Button>
            </Link>
            <Link to="/addRecipe">
              <Button variant="secondary">הוספת מתכון</Button>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[380px]">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[42%_58%_55%_45%/48%_44%_56%_52%] bg-accent-tint"
          />
          {/* Photo slot — swap /homepic.jpg to change the hero image */}
          <figure className="photo-taped m-0 -rotate-2">
            <img
              src="/homepic.jpg"
              alt="אנחנו מבשלים יחד במטבח הביתי"
              fetchpriority="high"
              className="aspect-[3/4] w-full rounded-[2px] object-cover"
            />
          </figure>
        </div>
      </section>

      <div className="divider-scallop" aria-hidden="true" />

      {/* Featured recipes (signed in) / what's inside (signed out) */}
      <section className="mx-auto max-w-[1200px] px-5 py-12 md:px-6 md:py-16">
        {isAuthenticated ? (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className="m-0 font-display text-xl font-black text-ink md:text-2xl">
                מבחר מהמטבח
              </h2>
              <Link
                to="/foodCategories"
                className="flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                לכל המתכונים
                <FaArrowLeft aria-hidden="true" />
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DishCardSkeleton key={i} />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {featured.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onClick={() => openDish(dish)} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-surface p-8 text-center shadow-sm">
                <p className="mb-4 text-md font-semibold text-text">
                  המטבח עוד ריק — זה הזמן למתכון הראשון.
                </p>
                <Link to="/addRecipe">
                  <Button variant="primary">הוספת מתכון ראשון</Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-6 text-center font-display text-xl font-black text-ink md:text-2xl">
              מה יש במטבח
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-md bg-surface p-6 shadow-sm">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent-tint text-accent">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 font-display text-md font-bold text-ink">{title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-text-muted">{text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* A letter from the kitchen */}
      <section className="mx-auto max-w-[760px] px-5 pb-16 md:px-6 md:pb-24">
        <div className="rounded-lg bg-surface p-6 shadow-sm md:p-10">
          <h2 className="mb-5 font-display text-lg font-black text-ink md:text-xl">
            מכתב מהמטבח
          </h2>
          <p className="letter-dropcap mb-4 leading-loose text-text">
            האתר הזה נולד מתוך <strong className="text-primary">אהבתי העזה לבישול ולאפייה</strong>.
            כל מתכון כאן מספר סיפור — אם זה המרק המנחם של סבתא, העוגה שאפיתי לראשונה
            כשהייתי ילדה, או המנה החדשנית שהמצאתי אתמול בלילה. כל אחד מהם הוא חלק ממסע
            הטעמים האישי שלי.
          </p>
          <p className="mb-4 leading-loose text-text">
            מעבר להיותו ארכיון דיגיטלי למתכונים שלי, האתר הזה הוא גם הדרך שלי{' '}
            <strong className="text-primary">לחלוק את אהבתי לאוכל עם העולם</strong>. אני מאמינה
            שאוכל הוא יותר מסתם מזון — הוא מחבר בין אנשים, יוצר זיכרונות, ומביא שמחה.
          </p>
          <p className="mb-4 leading-loose text-text">
            כמובן, אחת המטרות העיקריות של האתר היא לרכז את כל{' '}
            <strong className="text-primary">המתכונים האהובים על בן זוגי</strong> במקום אחד. ככה
            אני יכולה בקלות למצוא ולהכין את המנות האהובות עליו, ולהפתיע אותו מדי פעם עם
            משהו חדש ומרגש.
          </p>
          <p className="mb-4 leading-loose text-text">
            ומה שהתחיל כמטבח הפרטי שלי, הפך היום{' '}
            <strong className="text-primary">לבית של כל המשפחה</strong> — כל אחד ואחת
            מוסיפים ומנהלים את המתכונים שלהם, בפינה משלהם.
          </p>
          <p className="mb-4 leading-loose text-text">
            אני מזמינה אתכם לשוטט באתר, לגלות מתכונים חדשים, ואולי אפילו למצוא{' '}
            <strong className="text-primary">השראה למסע קולינרי משלכם</strong>. אל תהססו לנסות
            את המתכונים, לשנות אותם לטעמכם, ובעיקר — ליהנות מהתהליך ומהתוצאה!
          </p>
          <p className="m-0 font-display text-md font-bold text-ink">
            מקווה שתמצאו כאן הרבה טעמים, רעיונות והשראה.{' '}
            <span className="text-accent">בתיאבון!</span>
          </p>
        </div>
      </section>
    </div>
  );
};

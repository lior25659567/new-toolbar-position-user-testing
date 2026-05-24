import React from 'react';
import { color, font, space, radius, shadow } from '../../design-system/tokens';
import type { PatientInfo, ReportSettings, ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock } from './types';

// iTero logo (used only in the "Powered by" footer)
export function IteroLogoSvg() {
  return (
    <svg width="80" height="22" viewBox="0 0 103 28" fill="none">
      <path d="M79.2389 19.7792C79.2417 18.7027 79.0308 17.6364 78.6182 16.6421C78.2057 15.6478 77.5999 14.7454 76.8358 13.987C75.2477 12.4036 73.0828 11.532 70.7364 11.532C68.3919 11.532 66.2252 12.4036 64.639 13.987C63.8772 14.7461 63.2741 15.6491 62.8649 16.6435C62.4556 17.6379 62.2483 18.7039 62.2551 19.7792C62.2551 22.0073 63.0658 24.0664 64.5746 25.579C66.1307 27.1397 68.3202 28 70.7364 28C73.1527 28 75.3422 27.1397 76.9001 25.579C78.407 24.0664 79.2389 22.0073 79.2389 19.7792ZM75.4197 19.7792C75.4197 22.3042 73.2321 24.5192 70.7364 24.5192C68.2426 24.5192 66.0531 22.3042 66.0531 19.7792C66.0483 19.1467 66.1696 18.5196 66.4098 17.9344C66.6501 17.3493 67.0045 16.8179 67.4523 16.3712C68.3236 15.5008 69.5048 15.0118 70.7365 15.0118C71.9681 15.0118 73.1493 15.5008 74.0206 16.3712C74.4688 16.8176 74.8234 17.349 75.0636 17.9342C75.3039 18.5194 75.4249 19.1466 75.4197 19.7792ZM56.1254 15.8294H60.7869V11.8713H52.1682V27.7249H56.1254V15.8294ZM36.5939 21.2945H49.0215V20.7378C49.0215 18.0643 48.2312 15.7681 46.7357 14.0977C45.2534 12.4433 43.1358 11.532 40.7743 11.532C38.4506 11.532 36.3481 12.3989 34.8583 13.9738C33.427 15.4855 32.6386 17.5369 32.6386 19.7517C32.6386 21.9185 33.4195 23.9415 34.8356 25.4476C36.4067 27.117 38.6056 28 41.1959 28C43.8145 28 45.9738 27.0196 47.9608 24.9239L45.4216 22.3798C44.2172 23.7799 42.7463 24.5192 41.1675 24.5192C39.9273 24.5192 38.823 24.1401 37.9742 23.4217C37.315 22.8637 36.8349 22.1238 36.5939 21.2945ZM36.577 18.0956C36.9948 16.5584 38.2634 15.0118 40.746 15.0118C42.8219 15.0118 44.4611 16.2521 44.9281 18.0956H36.577ZM29.392 7.91404H34.8675V3.95686H19.9593V7.91404H25.4347V27.7249H29.392V7.91404Z" fill="black" fillOpacity="0.93"/>
      <path d="M56.1254 15.8294H60.7869V11.8713H52.1682V27.7249H56.1254V15.8294Z" fill="black" fillOpacity="0.93"/>
      <path d="M19.9572 11.8713H16V27.7249H19.9572V11.8713Z" fill="black" fillOpacity="0.93"/>
      <path d="M19.9572 0H16V3.95718H19.9572V0Z" fill="black" fillOpacity="0.93"/>
      <path d="M80.4516 11.8664H82.8465V12.3382H81.9222V14.8167H81.3708V12.3382H80.4516V11.8664Z" fill="black" fillOpacity="0.93"/>
      <path d="M83.2317 11.8664H83.9573L84.4414 13.2707C84.5565 13.6152 84.6992 14.2613 84.6992 14.2613H84.7114C84.7114 14.2613 84.8541 13.6192 84.9652 13.2707L85.4401 11.8664H86.182V14.8167H85.6704V13.2778C85.6704 12.9568 85.7061 12.3586 85.7061 12.3586H85.6979C85.6979 12.3586 85.5756 12.9018 85.4798 13.1953L84.9214 14.8167H84.477L83.9145 13.1953C83.8187 12.9018 83.6964 12.3586 83.6964 12.3586H83.6882C83.6882 12.3586 83.7239 12.9568 83.7239 13.2778V14.8167H83.2317V11.8664Z" fill="black" fillOpacity="0.93"/>
    </svg>
  );
}

// New header brand logo (Cland)
function HeaderBrandLogo() {
  return (
    <svg width="60" height="27" viewBox="0 0 1562 706" fill="none">
      <g clipPath="url(#clip0_807_14980)">
        <path d="M682.902 0C661.702 0 642.601 12.8 634.501 32.4C626.401 52 630.902 74.6 645.902 89.6C660.902 104.6 683.501 109.1 703.101 101C722.701 92.8 735.402 73.6 735.402 52.4C735.402 45.5 734.102 38.7 731.402 32.3C728.802 25.9 724.901 20.2 720.101 15.3C715.201 10.4 709.401 6.6 703.001 3.9C696.701 1.3 689.802 0 682.902 0Z" fill="var(--ads-background-interactive)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M1251.1 172.8H1331.7L1332.9 206.4C1338.5 199.5 1344.8 193.3 1351.7 187.9C1358.7 182.5 1366.2 177.8 1374.2 174C1382.2 170.3 1390.5 167.4 1399.1 165.5C1407.8 163.6 1416.6 162.6 1425.4 162.7C1513.8 162.7 1562 217.4 1562 312.7V534.6H1478.5V315.7C1478.5 266.7 1448.5 238.5 1406.5 238.5C1364.4 238.5 1334.6 266.7 1334.6 315.7V534.8H1251.1V172.8ZM546.2 534.8H462.8V8.6H546.4L546.2 534.8ZM641.2 172.8H724.9V534.8H641.2V172.8ZM285.1 172.8H367.7V534.8H285.1L283.8 496.9C276.4 504.3 268.4 511 259.8 516.9C251.2 522.8 242 527.8 232.4 532C222.9 536.1 212.9 539.3 202.7 541.5C192.5 543.7 182.1 544.9 171.7 545.1C73.1 545 0 465.6 0 354.3C0 235.6 79.2 162.7 171.7 162.7C182.2 162.4 192.7 163.2 203 165.2C213.3 167.2 223.4 170.2 233.1 174.4C242.7 178.6 251.9 183.7 260.4 189.9C268.9 196 276.8 203.1 283.8 210.9L285.1 172.8ZM85.4 354.3C85.4 423.8 127.9 470.1 187.1 470.1C241 470.1 289.2 430.5 289.2 354.3C289.2 279.9 243 238.5 187.4 238.5C125.3 238.5 85.4 287.2 85.4 354.3ZM1156 499C1156 654.4 1065.2 705.9 958.3 705.9C947.1 706.1 935.933 705.633 924.8 704.5C913.733 703.367 902.733 701.567 891.8 699.1C880.933 696.7 870.233 693.633 859.7 689.9C849.167 686.167 838.9 681.867 828.9 677L849.6 605.2C857.8 609.8 866.267 613.867 875 617.4C883.733 620.933 892.667 623.9 901.8 626.3C910.867 628.633 920.067 630.4 929.4 631.6C938.8 632.8 948.2 633.367 957.6 633.3C1019.8 633.3 1072.6 593.4 1072.6 521.5V496.6C1065.5 504.4 1057.5 511.5 1048.9 517.6C1040.3 523.7 1031 528.9 1021.3 533.1C1011.6 537.2 1001.4 540.3 991 542.3C980.7 544.3 970.1 545.1 959.5 544.9C862.1 544.9 788.5 466.4 788.5 353.6C788.5 245.6 857.8 162.5 959.9 162.5C970.4 162.1 980.9 162.9 991.3 164.9C1001.6 166.8 1011.7 169.9 1021.4 174.1C1031.1 178.2 1040.2 183.4 1048.8 189.6C1057.3 195.8 1065.1 202.9 1072.1 210.7L1073.2 172.6H1156V499ZM1077.2 354.3C1077.2 278.8 1029.7 238.5 975.6 238.5C911 238.5 873.7 291.1 873.7 354.3C873.7 421 913.9 470.1 975.6 470.1C1032.4 470.1 1077.2 427.8 1077.2 354.3Z" fill="var(--ads-text-primary)"/>
      </g>
      <defs>
        <clipPath id="clip0_807_14980">
          <rect width="1562" height="706" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Dental flower brand mark for the powered-by row
export function DentalFlowerLogo() {
  return (
    <svg width="100" height="24" viewBox="0 0 600 138" fill="none">
      <path d="M79.8016 77.9999C79.8016 77.9999 79.1016 105.1 117.602 115.8C106.402 77.2999 79.8016 77.9999 79.8016 77.9999Z" fill="var(--ads-text-primary)"/>
      <path d="M57.9016 56.3C57.9016 56.3 58.6016 29.3 20.1016 18.5C31.3016 57 57.9016 56.3 57.9016 56.3Z" fill="var(--ads-text-primary)"/>
      <path d="M68.8986 84.2C68.8986 84.2 49.2986 102.8 68.8986 137.6C88.2986 102.6 68.8986 84.2 68.8986 84.2Z" fill="var(--ads-text-primary)"/>
      <path d="M68.8019 53.4C68.8019 53.4 88.4019 34.8 68.8019 0C49.4019 35.1 68.8019 53.4 68.8019 53.4Z" fill="var(--ads-text-primary)"/>
      <path d="M84.3008 68.6998C84.3008 68.6998 102.901 88.2998 137.701 68.6998C102.601 49.3998 84.3008 68.6998 84.3008 68.6998Z" fill="var(--ads-text-primary)"/>
      <path d="M53.4 68.9001C53.4 68.9001 34.8 49.3001 0 68.9001C35.1 88.2001 53.4 68.9001 53.4 68.9001Z" fill="var(--ads-text-primary)"/>
      <path d="M79.7001 56.1999C79.7001 56.1999 106.7 56.8999 117.5 18.3999C79.0001 29.4999 79.7001 56.1999 79.7001 56.1999Z" fill="var(--ads-text-primary)"/>
      <path d="M57.9992 78.1C57.9992 78.1 30.8992 77.4 20.1992 115.9C58.6992 104.7 57.9992 78.1 57.9992 78.1Z" fill="var(--ads-text-primary)"/>
      <path d="M109.602 97.4C97.1019 77.5 79.8019 77.9 79.8019 77.9C79.8019 77.9 79.3019 95.6 99.5019 108C103.402 105.1 106.802 101.5 109.602 97.4Z" fill="var(--ads-text-primary)"/>
      <path d="M57.9008 56.3C57.9008 56.3 58.3008 40.1 40.7008 27.8C36.4008 30.8 32.5008 34.5001 29.3008 38.6001C41.7008 56.7001 57.9008 56.3 57.9008 56.3Z" fill="var(--ads-text-primary)"/>
      <path d="M68.9018 84.2C68.9018 84.2 56.6018 95.9 61.2018 118C63.7018 118.4 66.2018 118.6 68.8018 118.6C71.4018 118.6 73.9018 118.4 76.4018 118C81.1018 95.8 68.9018 84.2 68.9018 84.2Z" fill="var(--ads-text-primary)"/>
      <path d="M68.8 53.4C68.8 53.4 81.1 41.7 76.5 19.6C74 19.2 71.5 19 68.9 19C66.3 19 63.8 19.2 61.3 19.6C56.6 41.8 68.8 53.4 68.8 53.4Z" fill="var(--ads-text-primary)"/>
      <path d="M84.3008 68.6999C84.3008 68.6999 96.0008 80.9999 118.101 76.3999C118.501 73.8999 118.701 71.3999 118.701 68.7999C118.701 66.1999 118.501 63.6999 118.101 61.1999C95.8008 56.5999 84.3008 68.6999 84.3008 68.6999Z" fill="var(--ads-text-primary)"/>
      <path d="M53.4 68.9001C53.4 68.9001 41.7 56.6001 19.6 61.2001C19.2 63.7001 19 66.2001 19 68.8001C19 71.4001 19.2 73.9001 19.6 76.4001C41.9 81.0001 53.4 68.9001 53.4 68.9001Z" fill="var(--ads-text-primary)"/>
      <path d="M79.7 56.2C79.7 56.2 96.1 56.6001 108.4 38.6001C105.2 34.4001 101.4 30.7 97 27.8C79.3 40.1 79.7 56.2 79.7 56.2Z" fill="var(--ads-text-primary)"/>
      <path d="M58.0016 78.1C58.0016 78.1 40.5016 77.6 28.1016 97.4C30.9016 101.4 34.4016 105 38.2016 108.1C58.5016 95.5 58.0016 78.1 58.0016 78.1Z" fill="var(--ads-text-primary)"/>
      <path d="M98.199 84.7999C88.599 77.6999 79.899 77.9999 79.899 77.9999C79.899 77.9999 79.699 87.0999 86.999 96.8999C91.599 93.8999 95.499 89.6999 98.199 84.7999Z" fill="var(--ads-text-tertiary)"/>
      <path d="M57.9 56.3C57.9 56.3 58.1 48.6 52.4 39.8C47.8 42.4 43.9 46.1001 41 50.5001C50 56.5001 57.9 56.3 57.9 56.3Z" fill="var(--ads-text-tertiary)"/>
      <path d="M68.9008 84.2C68.9008 84.2 62.8008 90 60.8008 101.2C63.4008 101.8 66.0008 102.2 68.8008 102.2C71.6008 102.2 74.3008 101.8 76.9008 101.2C75.0008 90 68.9008 84.2 68.9008 84.2Z" fill="var(--ads-text-tertiary)"/>
      <path d="M68.8008 53.3999C68.8008 53.3999 74.9008 47.5999 76.9008 36.3999C74.3008 35.7999 71.6008 35.3999 68.9008 35.3999C66.1008 35.3999 63.4008 35.7999 60.8008 36.3999C62.7008 47.5999 68.8008 53.3999 68.8008 53.3999Z" fill="var(--ads-text-tertiary)"/>
      <path d="M101.201 60.7C90.0008 62.6 84.3008 68.7 84.3008 68.7C84.3008 68.7 90.1008 74.8 101.301 76.8C101.901 74.2 102.301 71.6 102.301 68.8C102.301 66 101.901 63.3 101.201 60.7Z" fill="var(--ads-text-tertiary)"/>
      <path d="M53.3984 68.9001C53.3984 68.9001 47.5984 62.8 36.3984 60.8C35.7984 63.4 35.3984 66 35.3984 68.8C35.3984 71.6 35.7984 74.3001 36.3984 76.9001C47.6984 74.9001 53.3984 68.9001 53.3984 68.9001Z" fill="var(--ads-text-tertiary)"/>
      <path d="M85.3016 39.7C79.6016 48.5 79.8016 56.1 79.8016 56.1C79.8016 56.1 87.8016 56.3 96.8016 50.3C93.8016 46 89.9016 42.3 85.3016 39.7Z" fill="var(--ads-text-tertiary)"/>
      <path d="M58.0016 78.0999C58.0016 78.0999 49.2016 77.8999 39.6016 84.8999C42.3016 89.7999 46.2016 93.8999 50.8016 96.8999C58.2016 87.0999 58.0016 78.0999 58.0016 78.0999Z" fill="var(--ads-text-tertiary)"/>
      <path d="M360.999 66.3001C360.999 70.8001 362.499 74.5001 365.399 77.6001C368.399 80.6001 371.999 82.2001 376.299 82.2001C380.199 82.2001 383.699 80.7001 386.699 77.6001C389.699 74.5001 391.199 71.0001 391.199 66.9001C391.199 62.6001 389.699 58.8001 386.699 55.7001C383.699 52.6001 380.199 51.0001 376.099 51.0001C371.899 51.0001 368.299 52.5001 365.399 55.4001C362.499 58.4001 360.999 62.0001 360.999 66.3001ZM391.799 91.8001V84.4001C389.599 86.7001 387.199 88.4001 384.499 89.5001C381.799 90.7001 378.999 91.2001 375.899 91.2001C368.799 91.2001 362.899 88.8001 358.199 84.1001C353.499 79.4001 351.199 73.4001 351.199 66.3001C351.199 63.0001 351.799 59.8001 352.999 56.8001C354.199 53.8001 355.799 51.2001 357.999 48.9001C360.399 46.4001 362.999 44.6001 365.799 43.4001C368.599 42.2001 371.799 41.6001 375.399 41.6001C378.599 41.6001 381.599 42.2001 384.299 43.3001C386.999 44.5001 389.499 46.2001 391.699 48.5001V42.8001H401.099V91.6001H391.799" fill="black"/>
      <path d="M466.402 66.3001C466.402 70.8001 467.902 74.5001 470.802 77.6001C473.802 80.6001 477.402 82.2001 481.702 82.2001C485.602 82.2001 489.102 80.7001 492.102 77.6001C495.102 74.5001 496.602 71.0001 496.602 66.9001C496.602 62.6001 495.102 58.8001 492.102 55.7001C489.102 52.6001 485.602 51.0001 481.502 51.0001C477.302 51.0001 473.702 52.5001 470.802 55.4001C467.802 58.4001 466.402 62.0001 466.402 66.3001ZM491.502 113C481.202 117.8 464.702 110 464.702 110L468.702 100.9C468.702 100.9 476.602 106.2 487.602 103.5C498.102 99.3001 497.202 90.2001 497.202 90.2001V84.4001C495.002 86.7001 492.602 88.4001 489.902 89.5001C487.202 90.7001 484.402 91.2001 481.302 91.2001C474.202 91.2001 468.302 88.8001 463.602 84.1001C458.902 79.4001 456.602 73.4001 456.602 66.3001C456.602 63.0001 457.202 59.8001 458.402 56.8001C459.602 53.8001 461.202 51.2001 463.402 48.9001C465.802 46.4001 468.402 44.6001 471.202 43.4001C474.002 42.2001 477.202 41.6001 480.802 41.6001C484.002 41.6001 487.002 42.2001 489.702 43.3001C492.402 44.4001 494.902 46.2001 497.102 48.5001V42.8001H506.502V90.0001C506.502 100 501.802 108.1 491.502 113Z" fill="black"/>
      <path d="M528.801 91.7H519.801V42.6001H528.101V48.0001C529.901 45.9001 532.101 44.3 534.201 43.3C536.301 42.3 538.801 41.8 541.501 41.8C547.701 41.8 552.501 43.6 555.801 47.3C559.101 51 560.801 56.2001 560.801 63.0001V91.7H551.601V64.9001C551.601 59.9001 550.701 56.1 548.801 53.7C546.901 51.3 544.101 50.0001 540.201 50.0001C536.001 50.0001 533.601 51.4 531.701 54.3C529.801 57.2 528.801 61.9001 528.801 68.5001V91.7Z" fill="black"/>
      <path d="M203.602 91.7H194.602V42.6001H202.902V48.0001C204.702 45.9001 206.902 44.3 209.002 43.3C211.102 42.3 213.602 41.8 216.302 41.8C222.502 41.8 227.302 43.6 230.602 47.3C233.902 51 235.602 56.2001 235.602 63.0001V91.7H226.402V64.9001C226.402 59.9001 225.502 56.1 223.602 53.7C221.702 51.3 218.902 50.0001 215.002 50.0001C210.802 50.0001 208.402 51.4 206.502 54.3C204.602 57.2 203.602 61.9001 203.602 68.5001V91.7Z" fill="black"/>
      <path d="M448.999 42.3999H438.699V91.6999H448.999V42.3999Z" fill="black"/>
      <path d="M436.699 27.0001C436.699 23.0001 439.899 19.8 443.899 19.8C447.799 19.8 451.099 23.0001 451.099 27.0001C451.099 31.0001 447.899 34.2 443.899 34.2C439.899 34.2 436.699 31.0001 436.699 27.0001Z" fill="black"/>
      <path d="M424.902 20.3999H414.602V91.6999H424.902V20.3999Z" fill="black"/>
      <path d="M302.698 42.3999H292.398V91.6999H302.698V42.3999Z" fill="black"/>
      <path d="M290.398 27.0001C290.398 23.0001 293.598 19.8 297.598 19.8C301.598 19.8 304.798 23.0001 304.798 27.0001C304.798 31.0001 301.598 34.2 297.598 34.2C293.598 34.2 290.398 31.0001 290.398 27.0001Z" fill="black"/>
      <path d="M180.8 42.3999H170.5V91.6999H180.8V42.3999Z" fill="black"/>
      <path d="M168.398 27.0001C168.398 23.0001 171.598 19.8 175.598 19.8C179.498 19.8 182.798 23.0001 182.798 27.0001C182.798 31.0001 179.598 34.2 175.598 34.2C171.598 34.2 168.398 31.0001 168.398 27.0001Z" fill="black"/>
      <path d="M238.602 42.3999H250.302L262.702 69.3999L276.202 42.3999H287.902L262.502 91.6999L238.602 42.3999Z" fill="black"/>
      <path d="M330.399 62.6C326.699 61.4 321.899 59.5 321.899 56.7C321.899 53.6 323.999 51.8 328.099 51.2C331.599 50.7 335.899 52.8 336.899 53.8L341.899 46C338.299 43.7 332.399 41.5 326.599 42.3C317.599 43.5 311.999 49.1 311.999 56.7C311.999 66.3 323.399 69.9 327.099 71.1C332.999 73 335.099 74.6 335.099 77.2C335.099 82.2 328.499 82.6 326.499 82.6C322.699 82.6 317.399 80.2 315.599 79.3L310.699 87.1C311.599 87.6 319.399 91.7 326.499 91.7C335.299 91.7 344.899 87.2 344.899 77.3C344.999 67.3 334.399 63.9 330.399 62.6Z" fill="black"/>
      <path d="M598.101 52.6C598.101 57.4 594.201 61.3 589.401 61.3C584.601 61.3 580.701 57.4 580.701 52.6C580.701 47.8 584.601 43.9 589.401 43.9C594.201 43.9 598.101 47.8 598.101 52.6ZM589.401 42C583.601 42 578.801 46.7 578.801 52.6C578.801 58.4 583.501 63.2 589.401 63.2C595.201 63.2 600.001 58.5 600.001 52.6C600.001 46.7 595.201 42 589.401 42Z" fill="black"/>
    </svg>
  );
}

type SupportedBlock = ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

// ─── Preview sub-components ──────────────────────────────────────────────────

function PreviewTeethTags({ teeth }: { teeth: number[] }) {
  if (teeth.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space[1], marginTop: space[2], alignItems: 'center' }}>
      <span style={{ fontSize: font.size.base, color: color.textSubtle, marginRight: space[1] }}>Teeth:</span>
      {teeth.map((t) => (
        <span key={t} style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: `2px 9px`,
          fontSize: font.size.base,
          fontWeight: font.weight.semibold,
          color: color.textSubtle,
          backgroundColor: color.bgPage,
          border: `1px solid ${color.borderDefault}`,
          borderRadius: radius.full,
        }}>
          {t}
        </span>
      ))}
    </div>
  );
}

function PreviewClinicalRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: space[2], fontSize: font.size.base, lineHeight: font.lineHeight.normal }}>
      <span style={{ color: color.textSubtle, fontWeight: font.weight.semibold, minWidth: '80px' }}>{label}:</span>
      <span style={{ color: color.textDefault }}>{value}</span>
    </div>
  );
}

// ─── Block Previews ─────────────────────────────────────────────────────────

/** Section heading used above every block (sentence case, no uppercase). */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: font.size.sm,
      fontWeight: font.weight.semibold,
      color: color.textHeading,
      marginBottom: space[3],
    }}>
      {children}
    </div>
  );
}

function ImageBlockPreview({ block }: { block: ImageBlock }) {
  const hasTeeth = block.teeth.length > 0;

  return (
    <div className="report-section">
      <SectionLabel>{block.title || 'Clinical photo'}</SectionLabel>
      {block.previewUrl ? (
        <img
          src={block.previewUrl}
          alt={block.title || 'Clinical image'}
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            objectFit: 'cover',
            display: 'block',
            backgroundColor: color.neutral50,
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: color.neutral50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.neutral300,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <circle cx="8.5" cy="10.5" r="2" />
            <path d="M5 20l5-6 3 3 4-5 4 4" />
          </svg>
        </div>
      )}

      {block.notes && (
        <div style={{ fontSize: font.size.sm, color: color.textSubtle, fontStyle: 'italic', marginTop: space[2], lineHeight: font.lineHeight.normal }}>
          {block.notes}
        </div>
      )}
      {hasTeeth && <div style={{ marginTop: space[2] }}><PreviewTeethTags teeth={block.teeth} /></div>}
    </div>
  );
}

function ComparisonBlockPreview({ block }: { block: ComparisonBlock }) {
  const renderSide = (img: { previewUrl: string }, label: string) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, textAlign: 'center', marginBottom: space[1] }}>
        {label}
      </div>
      {img.previewUrl ? (
        <img src={img.previewUrl} alt={label} style={{
          width: '100%', aspectRatio: '4 / 3', objectFit: 'cover',
          borderRadius: radius.md, backgroundColor: color.neutral50, display: 'block',
        }} />
      ) : (
        <div style={{
          width: '100%', aspectRatio: '4 / 3', backgroundColor: color.neutral50,
          borderRadius: radius.md, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: color.neutral300,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <circle cx="8.5" cy="10.5" r="2" />
            <path d="M5 20l5-6 3 3 4-5 4 4" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div className="report-section">
      <div style={{ display: 'flex', gap: space[2] }}>
        {renderSide(block.imageA, block.labelA || 'Before')}
        {renderSide(block.imageB, block.labelB || 'After')}
      </div>
      {block.notes && (
        <div style={{
          fontSize: font.size.xs, color: color.textDefault, lineHeight: font.lineHeight.normal,
          marginTop: space[2], paddingLeft: space[2], borderLeft: `2px solid ${color.neutral200}`,
        }}>
          {block.notes}
        </div>
      )}
    </div>
  );
}

function CostSummaryBlockPreview({ block }: { block: CostSummaryBlock }) {
  if (!block.content) return null;

  return (
    <div className="report-section">
      <SectionLabel>Cost summary</SectionLabel>
      <div style={{ fontSize: font.size.base, color: color.textDefault, lineHeight: font.lineHeight.normal, whiteSpace: 'pre-wrap' }}>
        {block.content}
      </div>
    </div>
  );
}

function NotesBlockPreview({ block }: { block: NotesBlock }) {
  if (!block.content) return null;
  return (
    <div className="report-section">
      <SectionLabel>Clinical notes</SectionLabel>
      <div style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textLabel, marginBottom: space[1] }}>
        Note
      </div>
      <div style={{ fontSize: font.size.base, color: color.textDefault, lineHeight: font.lineHeight.normal, whiteSpace: 'pre-wrap' }}>
        {block.content}
      </div>
    </div>
  );
}

function RxBlockPreview({ block }: { block: RxBlock }) {
  const hasContent = block.items.some((it) => it.medication);
  if (!hasContent) return null;

  return (
    <div className="report-section">
      <SectionLabel>Prescription</SectionLabel>
      <table style={{ width: '100%', fontSize: font.size.base, borderCollapse: 'collapse', color: color.textDefault }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${color.borderDefault}` }}>
            <th style={{ textAlign: 'left', padding: `${space[1]} 0`, fontWeight: font.weight.semibold, color: color.textLabel }}>Medication</th>
            <th style={{ textAlign: 'left', padding: `${space[1]} 0`, fontWeight: font.weight.semibold, color: color.textLabel, width: '80px' }}>Dosage</th>
            <th style={{ textAlign: 'left', padding: `${space[1]} 0`, fontWeight: font.weight.semibold, color: color.textLabel, width: '100px' }}>Frequency</th>
            <th style={{ textAlign: 'left', padding: `${space[1]} 0`, fontWeight: font.weight.semibold, color: color.textLabel, width: '80px' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {block.items.filter((it) => it.medication).map((item) => (
            <tr key={item.id} style={{ borderBottom: `1px solid ${color.neutral100}` }}>
              <td style={{ padding: `${space[1]} 0`, fontWeight: font.weight.semibold }}>{item.medication}</td>
              <td style={{ padding: `${space[1]} 0` }}>{item.dosage || '---'}</td>
              <td style={{ padding: `${space[1]} 0` }}>{item.frequency || '---'}</td>
              <td style={{ padding: `${space[1]} 0` }}>{item.duration || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {block.notes && (
        <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[2], fontStyle: 'italic' }}>
          {block.notes}
        </div>
      )}
    </div>
  );
}

function NextAppointmentBlockPreview({ block }: { block: NextAppointmentBlock }) {
  const hasContent = block.date || block.procedure;
  if (!hasContent) return null;

  return (
    <div className="report-section">
      <SectionLabel>Next appointment</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[2], fontSize: font.size.base }}>
        {block.date && (
          <div>
            <span style={{ color: color.textSubtle, fontWeight: font.weight.semibold }}>Date: </span>
            <span style={{ color: color.textDefault, fontWeight: font.weight.semibold }}>{block.date}</span>
          </div>
        )}
        {block.time && (
          <div>
            <span style={{ color: color.textSubtle, fontWeight: font.weight.semibold }}>Time: </span>
            <span style={{ color: color.textDefault, fontWeight: font.weight.semibold }}>{block.time}</span>
          </div>
        )}
      </div>
      {block.procedure && (
        <div style={{ fontSize: font.size.base, marginTop: space[1] }}>
          <span style={{ color: color.textSubtle, fontWeight: font.weight.semibold }}>Procedure: </span>
          <span style={{ color: color.textDefault }}>{block.procedure}</span>
        </div>
      )}
      {block.instructions && (
        <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[2], fontStyle: 'italic' }}>
          {block.instructions}
        </div>
      )}
    </div>
  );
}

function PatientInstructionsBlockPreview({ block }: { block: PatientInstructionsBlock }) {
  const hasContent = block.items.some((it) => it.text);
  if (!hasContent) return null;

  return (
    <div className="report-section">
      <SectionLabel>{block.title || 'Patient instructions'}</SectionLabel>
      <ol style={{ margin: 0, paddingLeft: '18px', fontSize: font.size.base, color: color.textDefault, lineHeight: '1.9' }}>
        {block.items.filter((it) => it.text).map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    </div>
  );
}

// ─── Main Preview ────────────────────────────────────────────────────────────

interface ReportPreviewProps {
  settings: ReportSettings;
  patient: PatientInfo;
  blocks: SupportedBlock[];
  onClinicLogoUpload?: (url: string) => void;
}

export default function ReportPreview({ settings, patient, blocks, onClinicLogoUpload }: ReportPreviewProps) {
  const reportDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div style={{
      backgroundColor: color.white,
      padding: `${space[10]} ${space[12]}`,
      minHeight: '700px',
      fontFamily: font.family,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      flexShrink: 0,
    }}>
      {/* Section rhythm: dividers + consistent spacing only between rendered sections */}
      <style>{`
        .report-section + .report-section {
          margin-top: ${space[8]};
          padding-top: ${space[8]};
          border-top: 1px solid var(--ds-border-subtle);
        }
      `}</style>
      {/* Header — clinic & doctor (left), patient & date (right) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space[6],
        paddingBottom: space[5],
        borderBottom: `2px solid ${color.primary}`,
        marginBottom: space[8],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[5], minWidth: 0 }}>
          {settings.clinicLogoUrl && (
            <img
              src={settings.clinicLogoUrl}
              alt="Clinic logo"
              style={{ height: '96px', maxWidth: '180px', objectFit: 'contain', flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: font.size.sm, color: color.textSubtle, fontWeight: font.weight.regular }}>
              {settings.clinicName || 'Clinic name'}
            </div>
            <div style={{ fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textHeading, letterSpacing: font.tracking.tight, marginTop: '2px' }}>
              {settings.doctorName || 'Doctor name'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textHeading, letterSpacing: font.tracking.tight }}>
            {patient.patientName || 'Patient name'}
          </div>
          <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[1] }}>
            Patient · {patient.chartNumber || '---'}
          </div>
          <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: '2px' }}>
            {reportDate}
          </div>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `${space[16]} 0`,
          color: color.textPlaceholder,
          fontSize: font.size.sm,
        }}>
          Add sections to see the report preview
        </div>
      ) : (
        <>
          {blocks.map((block) => {
            switch (block.type) {
              case 'image':
                return <ImageBlockPreview key={block.id} block={block as ImageBlock} />;
              case 'comparison':
                return <ComparisonBlockPreview key={block.id} block={block as ComparisonBlock} />;
              case 'cost-summary':
                return <CostSummaryBlockPreview key={block.id} block={block as CostSummaryBlock} />;
              case 'notes':
                return <NotesBlockPreview key={block.id} block={block as NotesBlock} />;
              case 'rx':
                return <RxBlockPreview key={block.id} block={block as RxBlock} />;
              case 'next-appointment':
                return <NextAppointmentBlockPreview key={block.id} block={block as NextAppointmentBlock} />;
              case 'patient-instructions':
                return <PatientInstructionsBlockPreview key={block.id} block={block as PatientInstructionsBlock} />;
              default:
                return null;
            }
          })}
        </>
      )}

      {/* Flex spacer pushes the signature + footer to the bottom (only when
          there's content; the empty state already fills the space). */}
      {blocks.length > 0 && <div style={{ flex: 1 }} />}

      {/* Signature line */}
      <div style={{
        marginTop: space[8],
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: space[6],
      }}>
        <div style={{ maxWidth: 360, width: '100%' }}>
          <div style={{
            minHeight: 56,
            display: 'flex',
            alignItems: 'flex-end',
            borderBottom: `1px solid ${color.textHeading}`,
            paddingBottom: space[2],
          }}>
            {settings.signatureUrl
              ? <img src={settings.signatureUrl} alt="Doctor signature" style={{ maxHeight: 48, maxWidth: '100%', objectFit: 'contain' }} />
              : <span style={{ fontSize: font.size.base, color: color.textPlaceholder }}>Signature</span>}
          </div>
          <div style={{ fontSize: font.size.sm, color: color.textSubtle, marginTop: space[2] }}>
            {settings.doctorName || 'Doctor name'}
          </div>
        </div>
        <span style={{ fontSize: font.size.sm, color: color.textSubtle, flexShrink: 0 }}>
          Generated {reportDate}
        </span>
      </div>

      {/* Powered by */}
      <div style={{
        borderTop: `1px solid ${color.borderDefault}`,
        marginTop: space[8],
        paddingTop: space[4],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: space[2],
      }}>
        <span style={{ fontSize: font.size.xs, color: color.textPlaceholder, fontWeight: font.weight.semibold }}>
          Powered by
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[5] }}>
          <IteroLogoSvg />
          <DentalFlowerLogo />
        </div>
      </div>
    </div>
  );
}

import {
    HiChartPie,
    HiUser,
    HiUsers,
    HiUserGroup,
    HiUserCircle,
    HiGift,
    HiClipboardCheck,
} from 'react-icons/hi'

export default [
    {
        name: 'Dashboard',
        show: true,
        icon: HiChartPie,
        route: route('dashboard'),
        active: 'dashboard',
    },
    {
        name: 'Master Data Peserta',
        show: true,
        icon: HiUserCircle,
        items: [
            {
                name: 'Import',
                show: true,
                icon: null,
                route: route('participant.import'),
                active: 'participant.import',
            },
            {
                name: 'Peserta',
                show: true,
                icon: null,
                route: route('participant.index'),
                active: 'participant.index',
            },
        ],
    },
    {
        name: 'Master Data Reward',
        show: true,
        icon: HiClipboardCheck,
        items: [
            {
                name: 'Event',
                show: true,
                icon: null,
                route: route('event.index'),
                active: 'event.*',
            },
            {
                name: 'Hadiah',
                show: true,
                icon: null,
                route: route('gift.index'),
                active: 'gift.*',
            },
            {
                name: 'Pembicara',
                show: true,
                icon: null,
                route: route('event.speakers.index'),
                active: 'event.speakers.*',
            },
            {
                name: 'Materi',
                show: true,
                icon: null,
                route: route('event.materials.index'),
                active: 'event.materials.*',
            },
        ],
    },
    {
        name: 'Data Drawing',
        show: true,
        icon: HiGift,
        route: route('draw.index'),
        active: 'draw.index',
    },
    {
        name: 'Absensi Event',
        show: true,
        icon: HiUserGroup,
        route: route('attendance.index'),
        active: 'attendance.*',
    },
    {
        name: 'Kalender Event',
        show: true,
        icon: HiChartPie,
        route: route('events.calendar'),
        active: 'events.calendar',
    },
    {
        name: 'Event Dashboard',
        show: true,
        icon: HiChartPie,
        route: route('events.dashboard'),
        active: 'events.dashboard',
    },
]

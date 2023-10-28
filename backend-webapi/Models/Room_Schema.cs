using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReservationApp.Models
{
    public class Room_Schema
    {
        public int tag { get; set; }
        public int Date { get; set; }
        public int time { get; set; }
        public Boolean isAvailable { get; set; }   
        public string Reserved_name { get; set; }
        public int Reserved_NetID { get; set; }
        public int Max_occupancy { get; set; }
        public Boolean isOffice { get; set; }

    }
}


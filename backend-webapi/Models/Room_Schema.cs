using System;
using System.ComponentModel.DataAnnotations;

namespace ReservationApp.Models
{
    public class Room
    {
        [Key]
        public string Building { get; set; } // Assuming 'Building' is a part of the primary key

        [Key]
        public string RoomNumber { get; set; } // Assuming 'Room' is a part of the primary key and is named 'RoomNumber' to avoid confusion with the class name

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime Time { get; set; } 

        public bool Available { get; set; }

        [StringLength(255)]
        public string ReservedName { get; set; } // Assuming this is a nullable field

        public long? ReservedNetID { get; set; }

        public int MaxOccupancy { get; set; }
        public bool IsOffice { get; set; }
    }
}


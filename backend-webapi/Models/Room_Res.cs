using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReservationApp.Models
{
    public class RoomRes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long NetID { get; set; }

        [Required]
        public long Building { get; set; } // Assuming this corresponds to a Building ID

        [Required]
        public long Room { get; set; } // Assuming this corresponds to a Room ID

        [Required]
        public DateTime RequestDate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }
}
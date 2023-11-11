using Reservation.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReservationApp.Models
{
    public class DeviceRes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } // Assuming there's an ID field that's a primary key

        [ForeignKey("User")]
        public long NetID { get; set; } // Assuming NetID is a foreign key to the Users table

        [ForeignKey("Device")]
        public int DeviceTag { get; set; } // Assuming DeviceTag is a foreign key to the Device table

        [Required]
        public DateTime RequestDate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public virtual User User { get; set; }
        public virtual Device Device { get; set; }
    }
}
